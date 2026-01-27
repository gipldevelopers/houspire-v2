'use client';

import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Package, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FloatingCart = ({ items = [], onCheckout, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal > 4999 ? 500 : 0;
  const total = subtotal - discount;

  const handleAdd = (itemId) => {
    // Add item logic here
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleRemove = (itemId) => {
    // Remove item logic here
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group"
      >
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </div>
      </button>

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 animate-slideUp">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-96">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-lg">Your Design Package</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="max-h-96 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add packages or add-ons to get started
                  </p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                          {item.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Early Bird Discount
                      </span>
                      <span className="font-medium text-green-600">
                        -₹{discount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={onCheckout}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  {onClear && (
                    <Button
                      onClick={onClear}
                      variant="outline"
                      className="w-full text-gray-600 hover:text-gray-800"
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>

                {/* Guarantee Badge */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>🔒</span>
                      <span>Secure Payment</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>🔄</span>
                      <span>7-Day Refund</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};