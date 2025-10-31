function scrapeProductData() {
  const data = {
    url: window.location.href,
    images: extractImages(),
    pageContent: extractPageContent()
  };

  return data;
}

function extractPageContent() {
  const content = {
    title: document.title,
    h1: '',
    metaDescription: '',
    textContent: ''
  };

  const h1 = document.querySelector('h1');
  if (h1) content.h1 = h1.textContent.trim();

  const metaDesc = document.querySelector('meta[name="description"]') ||
                   document.querySelector('meta[property="og:description"]');
  if (metaDesc) content.metaDescription = metaDesc.getAttribute('content');

  const jsonLd = extractFromJsonLd('full');
  if (jsonLd) content.jsonLd = jsonLd;

  const mainContent = document.querySelector('main') || document.body;
  const textNodes = [];
  const walk = document.createTreeWalker(
    mainContent,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript'].includes(tag)) return NodeFilter.FILTER_REJECT;
        const text = node.textContent.trim();
        if (text.length > 10) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_REJECT;
      }
    }
  );

  let node;
  let charCount = 0;
  while (node = walk.nextNode()) {
    const text = node.textContent.trim();
    textNodes.push(text);
    charCount += text.length;
    if (charCount > 3000) break;
  }

  content.textContent = textNodes.join(' ').substring(0, 3000);

  return content;
}

function extractFromJsonLd(field) {
  try {
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      const data = JSON.parse(script.textContent);

      const products = [];
      if (data['@type'] === 'Product') {
        products.push(data);
      } else if (Array.isArray(data)) {
        products.push(...data.filter(item => item['@type'] === 'Product'));
      } else if (data['@graph']) {
        products.push(...data['@graph'].filter(item => item['@type'] === 'Product'));
      }

      if (products.length > 0) {
        const product = products[0];

        if (field === 'full') {
          return product;
        } else if (field === 'brand') {
          if (product.brand?.name) return product.brand.name;
          if (typeof product.brand === 'string') return product.brand;
        } else if (field === 'name') {
          if (product.name) return product.name;
        } else if (field === 'price') {
          if (product.offers?.price) return parseFloat(product.offers.price);
          if (product.offers?.lowPrice) return parseFloat(product.offers.lowPrice);
        } else if (field === 'description') {
          if (product.description) return product.description;
        } else if (field === 'image') {
          if (product.image) {
            if (typeof product.image === 'string') return [product.image];
            if (Array.isArray(product.image)) return product.image;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error parsing JSON-LD:', e);
  }
  return null;
}


function extractImages() {
  const images = new Map();

  const jsonLdImages = extractFromJsonLd('image');
  if (jsonLdImages) {
    jsonLdImages.forEach(img => {
      const url = normalizeImageUrl(img);
      if (url) images.set(url, { priority: 10, width: 0, height: 0 });
    });
  }

  const metaSelectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:url"]',
    'meta[name="twitter:image"]',
    'link[rel="image_src"]'
  ];

  metaSelectors.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      const url = normalizeImageUrl(element.getAttribute('content') || element.getAttribute('href'));
      if (url) images.set(url, { priority: 9, width: 0, height: 0 });
    }
  });

  const imageSelectors = [
    'img[class*="product-image"]',
    'img[class*="productImage"]',
    'img[data-zoom-image]',
    'img[data-large-image]',
    'img[class*="gallery"]',
    'img[itemprop="image"]',
    'img[class*="product"]',
    '[class*="product-gallery"] img',
    '[class*="productGallery"] img',
    '[class*="product-media"] img',
    '[class*="image-gallery"] img',
    '[class*="carousel"] img',
    '[class*="slider"] img',
    'picture img',
    '[class*="product"] img',
    'main img'
  ];

  imageSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(img => {
      const sources = extractImageSources(img);
      sources.forEach(src => {
        if (!images.has(src)) {
          const width = img.naturalWidth || img.width || 0;
          const height = img.naturalHeight || img.height || 0;
          const priority = calculateImagePriority(img, selector);
          images.set(src, { priority, width, height });
        }
      });
    });
  });

  const sortedImages = Array.from(images.entries())
    .map(([url, data]) => ({ url, ...data }))
    .filter(img => {
      if (img.url.includes('placeholder') || img.url.includes('loading')) return false;
      if (img.url.includes('1x1') || img.url.includes('spacer')) return false;
      if (img.width > 0 && img.height > 0 && (img.width < 200 || img.height < 200)) return false;
      return true;
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (b.width * b.height) - (a.width * a.height);
    });

  const uniqueImages = deduplicateImages(sortedImages);

  return uniqueImages.map(img => ({
    url: img.url,
    width: img.width,
    height: img.height,
    priority: img.priority,
    quality: calculateImageQuality(img.width, img.height)
  }));
}

function calculateImageQuality(width, height) {
  if (width === 0 || height === 0) return 'unknown';

  const pixels = width * height;
  const minDimension = Math.min(width, height);

  if (minDimension >= 1200 && pixels >= 1000000) return 'excellent';
  if (minDimension >= 800 && pixels >= 600000) return 'high';
  if (minDimension >= 500 && pixels >= 250000) return 'good';
  if (minDimension >= 300) return 'fair';
  return 'low';
}

function deduplicateImages(images) {
  const unique = [];
  const seen = new Set();

  for (const img of images) {
    const normalized = normalizeImageUrlForComparison(img.url);

    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(img);
    }
  }

  return unique;
}

function normalizeImageUrlForComparison(url) {
  let normalized = url;

  normalized = normalized.split('?')[0];

  normalized = normalized.replace(/_\d+x\d+\./g, '.');
  normalized = normalized.replace(/[-_](thumb|small|medium|large|xlarge|xxl|thumbnail)\./gi, '.');
  normalized = normalized.replace(/[-_]\d+(w|h|x)\./gi, '.');
  normalized = normalized.replace(/[-_]\d+\./g, '.');

  normalized = normalized.replace(/\/w_\d+[^\/]*\//g, '/');
  normalized = normalized.replace(/\/h_\d+[^\/]*\//g, '/');
  normalized = normalized.replace(/\/c_\w+[^\/]*\//g, '/');

  return normalized;
}

function extractImageSources(img) {
  const sources = [];

  const zoomImage = img.getAttribute('data-zoom-image') ||
                    img.getAttribute('data-large-image') ||
                    img.getAttribute('data-zoom');
  if (zoomImage) {
    const url = normalizeImageUrl(zoomImage);
    if (url) sources.push(url);
    return [...new Set(sources)];
  }

  const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
  if (srcset) {
    const srcsetUrls = parseSrcset(srcset);
    const largest = srcsetUrls[srcsetUrls.length - 1];
    if (largest) {
      const normalized = normalizeImageUrl(largest);
      if (normalized) sources.push(normalized);
      return [...new Set(sources)];
    }
  }

  const imgSources = [
    img.getAttribute('src'),
    img.getAttribute('data-src'),
    img.getAttribute('data-lazy-src'),
    img.getAttribute('data-original'),
    img.getAttribute('data-image')
  ];

  for (const src of imgSources) {
    if (src) {
      const url = normalizeImageUrl(src);
      if (url) {
        sources.push(url);
        break;
      }
    }
  }

  return [...new Set(sources)];
}

function parseSrcset(srcset) {
  return srcset.split(',')
    .map(entry => entry.trim().split(/\s+/)[0])
    .filter(url => url && url.length > 0);
}

function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  url = url.trim();
  if (url.startsWith('data:')) return null;

  if (url.startsWith('//')) {
    url = 'https:' + url;
  } else if (url.startsWith('/')) {
    url = window.location.origin + url;
  } else if (!url.startsWith('http')) {
    return null;
  }

  return url;
}

function calculateImagePriority(img, selector) {
  let priority = 5;

  if (selector.includes('product-image') || selector.includes('productImage')) priority += 3;
  if (selector.includes('gallery')) priority += 2;
  if (img.getAttribute('data-zoom-image')) priority += 2;
  if (img.closest('picture')) priority += 1;
  if (selector.includes('carousel') || selector.includes('slider')) priority += 1;

  return priority;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    const data = scrapeProductData();
    sendResponse(data);
  }
  return true;
});
