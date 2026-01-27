export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground">Loading Secure Checkout</h2>
        <p className="text-muted-foreground mt-2">
          Preparing your payment environment...
        </p>
      </div>
    </div>
  );
}