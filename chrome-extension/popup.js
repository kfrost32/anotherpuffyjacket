let scrapedData = null;
let selectedFeaturedImage = null;
let selectedAdditionalImages = [];
let allImages = [];
let showingAllImages = false;
const INITIAL_IMAGE_COUNT = 12;

document.addEventListener('DOMContentLoaded', async () => {
  await initializePopup();
});

async function initializePopup() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrape' });

    scrapedData = response;

    const extractedData = await chrome.runtime.sendMessage({
      action: 'extractProductDataAndCommentary',
      pageContent: response.pageContent
    });

    scrapedData = { ...scrapedData, ...extractedData };

    populateForm(scrapedData);

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
  } catch (error) {
    showError('Failed to scrape page. Make sure you\'re on a product page.');
  }
}

function populateForm(data) {
  document.getElementById('name').value = data.name || '';
  document.getElementById('brand').value = data.brand || '';
  document.getElementById('price').value = data.price || '';
  document.getElementById('url').value = data.url || '';
  document.getElementById('description').value = data.description || '';
  document.getElementById('shortCommentary').value = data.short_commentary || '';
  document.getElementById('longCommentary').value = data.long_commentary || '';

  if (data.images && data.images.length > 0) {
    renderImageSelectors(data.images);
  } else {
    showError('No images found on this page.');
  }
}

function renderImageSelectors(images) {
  allImages = images;
  const featuredContainer = document.getElementById('featuredImageSelector');
  const additionalContainer = document.getElementById('additionalImagesSelector');

  featuredContainer.innerHTML = '';
  additionalContainer.innerHTML = '';

  const imagesToShow = showingAllImages ? images : images.slice(0, INITIAL_IMAGE_COUNT);

  imagesToShow.forEach((imageData, index) => {
    const featuredOption = createImageOption(imageData, index, 'featured');
    const additionalOption = createImageOption(imageData, index, 'additional');

    featuredContainer.appendChild(featuredOption);
    additionalContainer.appendChild(additionalOption);
  });

  if (images.length > INITIAL_IMAGE_COUNT && !showingAllImages) {
    const showMoreBtn = document.createElement('button');
    showMoreBtn.type = 'button';
    showMoreBtn.className = 'btn-secondary btn-small show-more-btn';
    showMoreBtn.textContent = `Show ${images.length - INITIAL_IMAGE_COUNT} more images`;
    showMoreBtn.addEventListener('click', () => {
      showingAllImages = true;
      renderImageSelectors(allImages);
    });

    featuredContainer.appendChild(showMoreBtn);
    additionalContainer.appendChild(showMoreBtn.cloneNode(true));
    additionalContainer.querySelector('.show-more-btn').addEventListener('click', () => {
      showingAllImages = true;
      renderImageSelectors(allImages);
    });
  }

  if (images.length > 0) {
    selectFeaturedImage(images[0].url);
  }
}

function createImageOption(imageData, index, type) {
  const src = imageData.url;
  const div = document.createElement('div');
  div.className = 'image-option';
  div.dataset.src = src;
  div.dataset.index = index;

  if (imageData.quality === 'low') {
    div.classList.add('low-quality');
  }

  const img = document.createElement('img');
  img.src = src;
  img.alt = `Image ${index + 1}`;
  img.loading = 'lazy';

  const checkmark = document.createElement('div');
  checkmark.className = 'checkmark';
  checkmark.textContent = '✓';

  const qualityBadge = createQualityBadge(imageData.quality);
  if (qualityBadge) {
    div.appendChild(qualityBadge);
  }

  const dimensionInfo = document.createElement('div');
  dimensionInfo.className = 'dimension-info';
  if (imageData.width > 0 && imageData.height > 0) {
    dimensionInfo.textContent = `${imageData.width}×${imageData.height}`;
  }

  div.appendChild(img);
  div.appendChild(checkmark);
  if (imageData.width > 0 && imageData.height > 0) {
    div.appendChild(dimensionInfo);
  }

  div.addEventListener('click', () => {
    if (type === 'featured') {
      selectFeaturedImage(src);
    } else {
      toggleAdditionalImage(src);
    }
  });

  return div;
}

function createQualityBadge(quality) {
  if (quality === 'unknown' || quality === 'fair') return null;

  const badge = document.createElement('div');
  badge.className = `quality-badge quality-${quality}`;

  const labels = {
    'excellent': 'HD',
    'high': 'HQ',
    'good': '✓',
    'low': '!'
  };

  badge.textContent = labels[quality] || '';
  return badge;
}

function selectFeaturedImage(src) {
  selectedFeaturedImage = src;

  document.querySelectorAll('#featuredImageSelector .image-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.src === src) {
      option.classList.add('selected');
    }
  });

  document.getElementById('featuredImage').value = src;
}

function toggleAdditionalImage(src) {
  const index = selectedAdditionalImages.indexOf(src);

  if (index > -1) {
    selectedAdditionalImages.splice(index, 1);
  } else {
    selectedAdditionalImages.push(src);
  }

  document.querySelectorAll('#additionalImagesSelector .image-option').forEach(option => {
    if (option.dataset.src === src) {
      option.classList.toggle('selected');
    }
  });
}

async function generateCommentary(description) {
  try {
    const commentary = await chrome.runtime.sendMessage({
      action: 'generateCommentary',
      description: description
    });

    if (commentary) {
      document.getElementById('shortCommentary').value = commentary.short || '';
      document.getElementById('longCommentary').value = commentary.long || '';
    }
  } catch (error) {
    console.error('Failed to generate commentary:', error);
  }
}

document.getElementById('regenerateShort').addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  const btn = document.getElementById('regenerateShort');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  try {
    const commentary = await chrome.runtime.sendMessage({
      action: 'generateCommentary',
      description: description
    });

    if (commentary) {
      document.getElementById('shortCommentary').value = commentary.short || '';
    }
  } catch (error) {
    showError('Failed to regenerate commentary');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Regenerate';
  }
});

document.getElementById('regenerateLong').addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  const btn = document.getElementById('regenerateLong');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  try {
    const commentary = await chrome.runtime.sendMessage({
      action: 'generateCommentary',
      description: description
    });

    if (commentary) {
      document.getElementById('longCommentary').value = commentary.long || '';
    }
  } catch (error) {
    showError('Failed to regenerate commentary');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Regenerate';
  }
});

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const publishBtn = document.getElementById('publishBtn');
  publishBtn.disabled = true;
  publishBtn.textContent = 'Publishing...';

  try {
    const formData = {
      name: document.getElementById('name').value,
      brand: document.getElementById('brand').value,
      price: parseFloat(document.getElementById('price').value) || null,
      url: document.getElementById('url').value,
      description: document.getElementById('description').value,
      short_commentary: document.getElementById('shortCommentary').value || null,
      long_commentary: document.getElementById('longCommentary').value || null,
      featured_image: selectedFeaturedImage,
      additional_images: selectedAdditionalImages
    };

    const result = await chrome.runtime.sendMessage({
      action: 'publishPost',
      data: formData
    });

    if (result.success) {
      showSuccess('Post published successfully!');
      setTimeout(() => window.close(), 2000);
    } else {
      showError(result.error || 'Failed to publish post');
    }
  } catch (error) {
    showError('Failed to publish: ' + error.message);
  } finally {
    publishBtn.disabled = false;
    publishBtn.textContent = 'Publish to Supabase';
  }
});

function showSuccess(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status success';
  status.classList.remove('hidden');
}

function showError(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status error';
  status.classList.remove('hidden');
}
