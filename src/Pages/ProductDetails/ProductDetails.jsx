import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star,
  ExternalLink,
  ArrowLeft,
  Truck,
  RotateCcw,
  Shield,
  Award,
  Package,
  Heart
} from 'lucide-react';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;

    const productRef = ref(database, `products/${productId}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProduct(data);
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

  return () => unsubscribe();
}, [productId]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;

    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const related = Object.entries(data)
          .filter(([pid, prod]) =>
            pid !== productId &&
            prod.category === product.category &&
            prod.subcategory === product.subcategory
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
    });

    return () => unsubscribe();
  }, [product, productId]);

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-orange-200 text-orange-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  // Product images (for future multiple images support)
  const productImages = product ? [product.imageUrl] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Thumbnail Images (for future multiple images) */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Breadcrumb */}
            <div className="text-sm text-orange-600 font-medium">
              {product.category} {product.subcategory && `> ${product.subcategory}`}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="text-lg text-gray-600 ml-2">({product.rating})</span>
              </div>
              {product.topBrand && (
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Top Brand
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-gray-900">₹{product.price}</div>

            {/* Product Features */}
            <div className="flex flex-wrap gap-3">
              {product.freeDelivery && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">Free Delivery</span>
                </div>
              )}
              {product.returnAvailable && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                  <RotateCcw className="w-5 h-5" />
                  <span className="font-medium">Returns Available</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure Purchase</span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
              <p className="text-gray-600 leading-relaxed">{product.details}</p>
            </div>

            {/* Additional Info */}
            {product.item && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Information</h3>
                <p className="text-gray-600">{product.item}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <a
                href={product.referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-orange-500 text-white text-center py-4 px-6 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                Buy Now
                <ExternalLink className="w-5 h-5" />
              </a>
              <button className="bg-gray-200 text-gray-900 p-4 rounded-lg hover:bg-gray-300 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(([productId, relatedProduct]) => (
                <div key={productId} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    {relatedProduct.topBrand && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Top Brand
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {renderStars(relatedProduct.rating)}
                        <span className="text-sm text-gray-600 ml-1">({relatedProduct.rating})</span>
                      </div>
                    </div>

                    <div className="text-lg font-bold text-gray-900 mb-3">₹{relatedProduct.price}</div>

                    <Link
                      to={`/product/${productId}`}
                      className="block bg-gray-900 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;