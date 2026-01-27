// Add onPackageSelect prop
export const StickyBottomCTA = ({ onPackageSelect }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t shadow-lg">
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        <button
          onClick={() => onPackageSelect(499, 'Room Trial')}
          className="flex-1 min-w-[100px] min-h-[48px] py-3 bg-[#10B981] text-white rounded text-base font-bold"
        >
          ₹499
        </button>
        {/* ... other buttons */}
      </div>
    </div>
  );
};