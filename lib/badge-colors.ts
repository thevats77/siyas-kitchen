export function sourceBadgeClass(source: string) {
  switch (source) {
    case "Swiggy":
      return "bg-orange-100 text-orange-700";
    case "Zomato":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function paymentBadgeClass(method: string) {
  switch (method) {
    case "Cash":
      return "bg-green-100 text-green-700";
    case "UPI":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-purple-100 text-purple-700";
  }
}
