importScripts('config.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProductDataAndCommentary') {
    handleExtractProductDataAndCommentary(request.pageContent)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'extractProductData') {
    handleExtractProductData(request.pageContent)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'generateCommentary') {
    handleGenerateCommentary(request.description)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'publishPost') {
    handlePublishPost(request.data)
      .then(sendResponse)
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleExtractProductDataAndCommentary(pageContent) {
  try {
    const prompt = buildCombinedExtractionPrompt(pageContent);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a product data extraction expert and outdoor gear specialist. Extract product information and write engaging commentary for Another Puffy Jacket, a curated directory of outdoor equipment.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0].message.content);

    return {
      name: extracted.name || '',
      brand: extracted.brand || '',
      price: extracted.price || null,
      description: extracted.description || '',
      short_commentary: extracted.short_commentary || '',
      long_commentary: extracted.long_commentary || ''
    };
  } catch (error) {
    console.error('Error extracting product data and commentary:', error);
    return {
      name: '',
      brand: '',
      price: null,
      description: '',
      short_commentary: '',
      long_commentary: ''
    };
  }
}

function buildCombinedExtractionPrompt(pageContent) {
  let prompt = 'Extract product information and write commentary for this outdoor gear product:\n\n';

  if (pageContent.jsonLd) {
    prompt += `JSON-LD Product Data:\n${JSON.stringify(pageContent.jsonLd, null, 2)}\n\n`;
  }

  prompt += `Page Title: ${pageContent.title}\n`;
  prompt += `H1: ${pageContent.h1}\n`;
  prompt += `Meta Description: ${pageContent.metaDescription}\n\n`;
  prompt += `Page Text Content (first 3000 chars):\n${pageContent.textContent}\n\n`;

  prompt += `Extract and generate the following:

PRODUCT DATA:
- name: Clean product name (without brand prefix)
- brand: Brand/manufacturer name
- price: Numeric price (no currency symbol)
- description: Concise product description (2-4 sentences)

COMMENTARY:
- short_commentary: Brief, punchy insight (1-2 sentences) about what makes this product interesting
- long_commentary: Detailed analysis (2-3 paragraphs) covering features, use cases, and what makes it noteworthy

Return only valid JSON in this format:
{
  "name": "...",
  "brand": "...",
  "price": 123.45,
  "description": "...",
  "short_commentary": "...",
  "long_commentary": "..."
}`;

  return prompt;
}

async function handleExtractProductData(pageContent) {
  try {
    const prompt = buildExtractionPrompt(pageContent);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a product data extraction expert. Extract product information from web page content and return it as structured JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0].message.content);

    return {
      name: extracted.name || '',
      brand: extracted.brand || '',
      price: extracted.price || null,
      description: extracted.description || ''
    };
  } catch (error) {
    console.error('Error extracting product data:', error);
    return { name: '', brand: '', price: null, description: '' };
  }
}

function buildExtractionPrompt(pageContent) {
  let prompt = 'Extract the following product information from this web page:\n\n';

  if (pageContent.jsonLd) {
    prompt += `JSON-LD Product Data:\n${JSON.stringify(pageContent.jsonLd, null, 2)}\n\n`;
  }

  prompt += `Page Title: ${pageContent.title}\n`;
  prompt += `H1: ${pageContent.h1}\n`;
  prompt += `Meta Description: ${pageContent.metaDescription}\n\n`;
  prompt += `Page Text Content (first 3000 chars):\n${pageContent.textContent}\n\n`;

  prompt += `Extract and return JSON with these fields:
- name: The product name (clean, without brand prefix)
- brand: The brand/manufacturer name
- price: The numeric price (just the number, no currency symbol)
- description: A concise product description (2-4 sentences)

If this is outdoor/sporting goods (jacket, tent, backpack, etc), focus on those details.
Return only valid JSON in this format: {"name": "...", "brand": "...", "price": 123.45, "description": "..."}`;

  return prompt;
}

async function handleGenerateCommentary(description) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.openai.apiKey}`
      },
      body: JSON.stringify({
        model: CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable outdoor gear expert writing commentary for Another Puffy Jacket, a curated directory of outdoor equipment. Your commentary should be informative, engaging, and highlight what makes this product interesting or noteworthy.'
          },
          {
            role: 'user',
            content: `Generate two versions of commentary for this outdoor gear product:

1. SHORT (1-2 sentences): A brief, punchy observation or insight about the product
2. LONG (2-3 paragraphs): A more detailed analysis covering features, use cases, and what makes it noteworthy

Product description:
${description}

Return as JSON: {"short": "...", "long": "..."}`
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return content;
  } catch (error) {
    console.error('Error generating commentary:', error);
    return { short: '', long: '' };
  }
}

async function handlePublishPost(data) {
  try {
    const uploadPromises = [uploadImageToSupabase(data.featured_image)];

    if (data.additional_images && data.additional_images.length > 0) {
      const additionalPromises = data.additional_images.map(url =>
        uploadImageToSupabase(url).catch(error => {
          console.error('Failed to upload additional image:', error);
          return null;
        })
      );
      uploadPromises.push(...additionalPromises);
    }

    const uploadedUrls = await Promise.all(uploadPromises);

    const featuredImageUrl = uploadedUrls[0];
    const additionalImageUrls = uploadedUrls.slice(1).filter(url => url !== null);

    const postData = {
      name: data.name,
      brand: data.brand,
      price: data.price,
      url: data.url,
      description: data.description,
      short_commentary: data.short_commentary,
      long_commentary: data.long_commentary,
      feature_image: featuredImageUrl,
      additional_images: additionalImageUrls.length > 0 ? additionalImageUrls : null,
      published: true
    };

    const response = await fetch(`${CONFIG.supabase.url}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.supabase.serviceRoleKey,
        'Authorization': `Bearer ${CONFIG.supabase.serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase API error: ${error}`);
    }

    const result = await response.json();

    return { success: true, data: result };
  } catch (error) {
    console.error('Error publishing post:', error);
    return { success: false, error: error.message };
  }
}

async function uploadImageToSupabase(imageUrl) {
  try {
    const imageBlob = await fetchImageAsBlob(imageUrl);

    const fileName = `${Date.now()}-${generateRandomString()}.${getImageExtension(imageBlob.type)}`;

    const uploadResponse = await fetch(
      `${CONFIG.supabase.url}/storage/v1/object/${CONFIG.supabase.storageBucket}/${fileName}`,
      {
        method: 'POST',
        headers: {
          'apikey': CONFIG.supabase.serviceRoleKey,
          'Authorization': `Bearer ${CONFIG.supabase.serviceRoleKey}`,
          'Content-Type': imageBlob.type
        },
        body: imageBlob
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const publicUrl = `${CONFIG.supabase.url}/storage/v1/object/public/${CONFIG.supabase.storageBucket}/${fileName}`;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function fetchImageAsBlob(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return await response.blob();
}

function getImageExtension(mimeType) {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
  };
  return extensions[mimeType] || 'jpg';
}

function generateRandomString() {
  return Math.random().toString(36).substring(2, 15);
}
