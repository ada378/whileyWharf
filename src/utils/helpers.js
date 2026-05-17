export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'badge-warning',
    CONFIRMED: 'badge-info',
    PROCESSING: 'badge-info',
    SHIPPED: 'badge-info',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger',
    RETURNED: 'badge-warning',
    REFUNDED: 'badge-gray',
    PAID: 'badge-success',
    FAILED: 'badge-danger',
    ACTIVE: 'badge-success',
    INACTIVE: 'badge-gray',
  }
  return colors[status] || 'badge-gray'
}

export const truncate = (str, length = 100) => {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const generateSessionId = () => {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// Maps product name keywords to high-quality Unsplash images
const IMAGE_KEYWORD_MAP = [
  { keywords: ['iphone', 'apple phone', 'smartphone', 'mobile phone'], query: 'iphone-smartphone-product' },
  { keywords: ['samsung', 'galaxy', 'android phone'], query: 'samsung-galaxy-smartphone' },
  { keywords: ['laptop', 'macbook', 'notebook', 'computer'], query: 'laptop-computer-desk' },
  { keywords: ['headphone', 'earphone', 'airpod', 'earbuds', 'wireless audio'], query: 'headphones-music-audio' },
  { keywords: ['watch', 'smartwatch', 'timepiece', 'wristwatch'], query: 'luxury-watch-wristwatch' },
  { keywords: ['camera', 'dslr', 'mirrorless', 'lens', 'photography'], query: 'camera-photography-lens' },
  { keywords: ['tv', 'television', 'monitor', 'display', 'screen'], query: 'television-smart-tv' },
  { keywords: ['tablet', 'ipad', 'kindle'], query: 'tablet-ipad-digital' },
  { keywords: ['speaker', 'bluetooth speaker', 'soundbar'], query: 'bluetooth-speaker-audio' },
  { keywords: ['keyboard', 'mouse', 'gaming'], query: 'gaming-keyboard-setup' },
  { keywords: ['shoe', 'sneaker', 'boot', 'footwear', 'nike', 'adidas'], query: 'sneakers-shoes-fashion' },
  { keywords: ['shirt', 't-shirt', 'tshirt', 'polo', 'top'], query: 'fashion-shirt-clothing' },
  { keywords: ['dress', 'gown', 'frock', 'skirt'], query: 'fashion-dress-women' },
  { keywords: ['jeans', 'trouser', 'pant', 'denim'], query: 'jeans-denim-fashion' },
  { keywords: ['jacket', 'coat', 'hoodie', 'sweatshirt', 'sweater'], query: 'jacket-fashion-outerwear' },
  { keywords: ['bag', 'handbag', 'backpack', 'purse', 'tote'], query: 'handbag-fashion-bag' },
  { keywords: ['sunglasses', 'glasses', 'eyewear', 'spectacles'], query: 'sunglasses-fashion-eyewear' },
  { keywords: ['perfume', 'fragrance', 'cologne', 'deodorant'], query: 'perfume-fragrance-luxury' },
  { keywords: ['lipstick', 'makeup', 'cosmetic', 'foundation', 'mascara'], query: 'makeup-cosmetics-beauty' },
  { keywords: ['skincare', 'moisturizer', 'serum', 'cream', 'lotion', 'face wash'], query: 'skincare-beauty-products' },
  { keywords: ['sofa', 'couch', 'furniture', 'chair', 'table'], query: 'modern-furniture-interior' },
  { keywords: ['lamp', 'light', 'bulb', 'chandelier'], query: 'modern-lamp-interior-lighting' },
  { keywords: ['bed', 'mattress', 'pillow', 'bedsheet', 'blanket'], query: 'bedroom-bed-interior' },
  { keywords: ['kitchen', 'cookware', 'pan', 'pot', 'utensil'], query: 'kitchen-cookware-cooking' },
  { keywords: ['mixer', 'blender', 'juicer', 'grinder'], query: 'kitchen-blender-appliance' },
  { keywords: ['refrigerator', 'fridge', 'freezer'], query: 'refrigerator-kitchen-appliance' },
  { keywords: ['washing machine', 'washer', 'dryer'], query: 'washing-machine-appliance' },
  { keywords: ['air conditioner', 'ac', 'fan', 'cooler'], query: 'air-conditioner-cooling' },
  { keywords: ['book', 'novel', 'textbook', 'magazine'], query: 'books-reading-library' },
  { keywords: ['toy', 'lego', 'doll', 'action figure', 'puzzle'], query: 'toys-children-play' },
  { keywords: ['cycle', 'bicycle', 'bike'], query: 'bicycle-cycling-sport' },
  { keywords: ['yoga', 'mat', 'fitness', 'gym', 'dumbbell', 'weight'], query: 'fitness-gym-workout' },
  { keywords: ['cricket', 'bat', 'ball', 'sport'], query: 'cricket-sport-equipment' },
  { keywords: ['football', 'soccer'], query: 'football-soccer-sport' },
  { keywords: ['protein', 'supplement', 'whey', 'nutrition'], query: 'protein-supplement-fitness' },
  { keywords: ['coffee', 'tea', 'beverage', 'drink'], query: 'coffee-beverage-drink' },
  { keywords: ['chocolate', 'candy', 'sweet', 'snack'], query: 'chocolate-sweets-food' },
  { keywords: ['pen', 'pencil', 'stationery', 'notebook'], query: 'stationery-pen-desk' },
  { keywords: ['wallet', 'card holder', 'money clip'], query: 'leather-wallet-fashion' },
  { keywords: ['ring', 'necklace', 'bracelet', 'jewellery', 'jewelry', 'earring'], query: 'jewelry-luxury-accessories' },
]

const UNSPLASH_SEEDS = ['product1', 'product2', 'product3', 'product4', 'product5']

export const getProductImage = (productName, existingImage, index = 0) => {
  if (existingImage && !existingImage.includes('placeholder') && !existingImage.includes('via.placeholder')) {
    return existingImage
  }

  if (!productName) {
    return `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80`
  }

  const nameLower = productName.toLowerCase()
  const matched = IMAGE_KEYWORD_MAP.find(({ keywords }) =>
    keywords.some((kw) => nameLower.includes(kw))
  )

  const seed = UNSPLASH_SEEDS[index % UNSPLASH_SEEDS.length]
  const query = matched ? matched.query : 'product-shopping-ecommerce'

  return `https://source.unsplash.com/600x600/?${query}&sig=${seed}${index}`
}

export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
  return url
}
