import { useState, useEffect } from "react";
import { 
  ShoppingBag, Tractor, Users, Sprout, Hammer, Search, Filter, 
  ShoppingCart, Star, Home, ClipboardList, Wallet, Bell, 
  ArrowRightLeft, Plus, Clock, CheckCircle2, AlertCircle,
  TrendingUp, ArrowUpRight, ArrowDownLeft, Trash2,
  Package, Leaf, BadgeIndianRupee, MapPin, MessageSquare,
  Calendar, BarChart3, LineChart, History, IndianRupee, Store,
  ArrowRight, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "../contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  getDoc,
  limit
} from "firebase/firestore";
import { toast } from "sonner";

type MartTab = "home" | "orders" | "wallet" | "notifications" | "farmer_dashboard" | "vendor_dashboard" | "category_view";

export default function AgroMart() {
  const [activeMartTab, setActiveMartTab] = useState<MartTab>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("farmer"); // Default to farmer for demo
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    name: "",
    category: "Crops",
    price: "",
    unit: "kg",
    stock: "",
    location: "My Farm",
    image: ""
  });
  const [orderFilter, setOrderFilter] = useState("pending");
  const [orders, setOrders] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("All");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | "none">("none");
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || "farmer");
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    // Listen for Orders
    const ordersQuery = query(
      collection(db, "orders"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for Transactions
    const txnsQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeTxns = onSnapshot(txnsQuery, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setTransactions(txs);
      
      // Calculate balance (simple mock logic for now)
      let bal = 12450; // Starting balance
      txs.forEach(t => {
        const amtStr = t.amount?.toString().replace(/[^0-9]/g, '') || "0";
        const amt = parseInt(amtStr);
        if (t.type === 'in') bal += amt;
        else bal -= amt;
      });
      setBalance(bal);
    });

    // Listen for Notifications
    const notifsQuery = query(
      collection(db, "notifications"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeNotifs = onSnapshot(notifsQuery, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for Products
    const productsQuery = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      setDbProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false);

    return () => {
      unsubscribeOrders();
      unsubscribeTxns();
      unsubscribeNotifs();
      unsubscribeProducts();
    };
  }, []);

  const handleAction = async (item: string, type: string, amount: string, extraData: any = {}) => {
    if (!auth.currentUser) {
      toast.error("Please login to continue");
      return;
    }

    if (type === "Buy" || type === "Rent") {
      setPaymentData({ item, type, amount, extraData });
      setIsPaymentModalOpen(true);
      return;
    }

    try {
      // Create Order
      await addDoc(collection(db, "orders"), {
        uid: auth.currentUser.uid,
        item,
        type,
        status: "pending",
        amount,
        ...extraData,
        createdAt: serverTimestamp()
      });

      // Create Transaction
      await addDoc(collection(db, "transactions"), {
        uid: auth.currentUser.uid,
        type: type === "Sell" || type === "RentOut" ? "in" : "out",
        label: `${type} ${item}`,
        amount,
        createdAt: serverTimestamp()
      });

      // Create Notification
      await addDoc(collection(db, "notifications"), {
        uid: auth.currentUser.uid,
        title: `${type} Request`,
        message: `Your ${type.toLowerCase()} request for ${item} has been placed successfully.`,
        unread: true,
        createdAt: serverTimestamp()
      });

      toast.success(`${type} request placed for ${item}`);
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Failed to process request");
    }
  };

  const processPayment = async () => {
    if (!auth.currentUser || !paymentData) return;
    
    setIsProcessingPayment(true);
    try {
      // 1. Create Order (Awaiting Payment)
      const orderRef = await addDoc(collection(db, "orders"), {
        uid: auth.currentUser.uid,
        item: paymentData.item,
        type: paymentData.type,
        status: "pending",
        amount: paymentData.amount,
        paymentStatus: "awaiting",
        ...paymentData.extraData,
        createdAt: serverTimestamp()
      });

      // Simulate network delay for payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Update Order Status to Paid
      await updateDoc(doc(db, "orders", orderRef.id), {
        status: "Paid",
        paymentStatus: "paid",
        paidAt: serverTimestamp()
      });

      // 3. Create Transaction
      await addDoc(collection(db, "transactions"), {
        uid: auth.currentUser.uid,
        type: "out",
        label: `${paymentData.type} ${paymentData.item}`,
        amount: paymentData.amount,
        orderId: orderRef.id,
        createdAt: serverTimestamp()
      });

      // 4. Create Notification
      await addDoc(collection(db, "notifications"), {
        uid: auth.currentUser.uid,
        title: "Payment Successful",
        message: `Payment for ${paymentData.item} was successful. Your order is now active.`,
        unread: true,
        createdAt: serverTimestamp()
      });

      toast.success("Payment Successful!");
      setIsPaymentModalOpen(false);
      setPaymentData(null);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart`);
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => n.unread);
    try {
      await Promise.all(unread.map(n => 
        updateDoc(doc(db, "notifications", n.id), { unread: false })
      ));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "cancelled" });
      toast.success("Order cancelled");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const categories = [
    { id: "crops", label: "Crops", icon: Leaf },
    { id: "nursery", label: "Nursery", icon: Sprout },
    { id: "machinery", label: "Machinery", icon: Tractor },
    { id: "tools", label: "Tools", icon: Hammer },
  ];

  const initialProducts: any[] = [];

  const productList = [...dbProducts, ...initialProducts];

  const handleCreateListing = async () => {
    if (!auth.currentUser) {
      toast.error("Please login to list products");
      return;
    }

    if (!newListing.name || !newListing.price || !newListing.stock) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const productData = {
        uid: auth.currentUser.uid,
        name: newListing.name,
        price: `₹${newListing.price}/${newListing.unit}`,
        rating: 5.0,
        category: newListing.category,
        subCategory: "Other",
        image: newListing.image || `https://picsum.photos/seed/${newListing.name}/400/300`,
        type: "buy",
        location: newListing.location,
        farmer: auth.currentUser?.displayName || "Me",
        stock: `${newListing.stock}${newListing.unit}`,
        isBestSeller: false,
        scientificName: "",
        growthTime: "",
        waterNeed: "",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "products"), productData);
      
      setIsSellModalOpen(false);
      setNewListing({
        name: "",
        category: "Crops",
        price: "",
        unit: "kg",
        stock: "",
        location: "My Farm",
        image: ""
      });
      toast.success("Product listed successfully!");
    } catch (error) {
      console.error("Error listing product:", error);
      toast.error("Failed to list product. Please try again.");
    }
  };

  const renderSellModal = () => (
    <AnimatePresence>
      {isSellModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSellModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#5A5A40]"><Translate>List Your Product</Translate></h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSellModalOpen(false)}>
                <Plus className="w-5 h-5 rotate-45" />
              </Button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700"><Translate>Product Name</Translate></label>
                <Input 
                  placeholder="e.g. Organic Wheat" 
                  value={newListing.name}
                  onChange={(e) => setNewListing({...newListing, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700"><Translate>Category</Translate></label>
                  <select 
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                    value={newListing.category}
                    onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700"><Translate>Unit</Translate></label>
                  <select 
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                    value={newListing.unit}
                    onChange={(e) => setNewListing({...newListing, unit: e.target.value})}
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="plant">per plant</option>
                    <option value="pkt">packet</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700"><Translate>Price per Unit (₹)</Translate></label>
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    value={newListing.price}
                    onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700"><Translate>Available Stock</Translate></label>
                  <Input 
                    type="number"
                    placeholder="0" 
                    value={newListing.stock}
                    onChange={(e) => setNewListing({...newListing, stock: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700"><Translate>Location</Translate></label>
                <Input 
                  placeholder="e.g. Nashik, Maharashtra" 
                  value={newListing.location}
                  onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700"><Translate>Product Image</Translate></label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Paste image URL here..." 
                      value={newListing.image}
                      onChange={(e) => setNewListing({...newListing, image: e.target.value})}
                      className="rounded-xl flex-1"
                    />
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewListing({...newListing, image: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button variant="outline" className="rounded-xl border-dashed border-2">
                        <Plus className="w-4 h-4 mr-2" />
                        <Translate>Upload</Translate>
                      </Button>
                    </div>
                  </div>
                  {newListing.image && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img 
                        src={newListing.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 rounded-full w-8 h-8"
                        onClick={() => setNewListing({...newListing, image: ""})}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl font-bold"
                onClick={() => setIsSellModalOpen(false)}
              >
                <Translate>Cancel</Translate>
              </Button>
              <Button 
                className="flex-1 bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold"
                onClick={handleCreateListing}
              >
                <Translate>List Product</Translate>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderPaymentModal = () => (
    <AnimatePresence>
      {isPaymentModalOpen && paymentData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1a1a] text-white rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Razorpay-like Header */}
            <div className="bg-[#2b2b2b] p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xl">R</div>
                <div>
                  <h3 className="font-bold text-sm">Razorpay Checkout</h3>
                  <p className="text-[10px] text-gray-400">AgroDhan Marketplace</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Amount</p>
                <p className="text-lg font-black text-blue-400">{paymentData.amount}</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">{paymentData.item}</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-none">{paymentData.type}</Badge>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Payment Method</p>
                  <div className="grid grid-cols-1 gap-2">
                    {["UPI (Google Pay, PhonePe)", "Cards (Visa, Mastercard)", "Netbanking"].map((method, i) => (
                      <button key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors text-left group">
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{method}</span>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={processPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-14 font-black text-lg shadow-lg shadow-blue-600/20"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay ${paymentData.amount}`
                  )}
                </Button>
                <p className="text-[10px] text-center text-gray-500 mt-4">
                  Secure payments by Razorpay. Do not refresh this page.
                </p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderCategoryView = () => {
    let filteredProducts = productList.filter(p => p.category === selectedCategory);
    
    if (subCategoryFilter !== "All") {
      filteredProducts = filteredProducts.filter(p => p.subCategory === subCategoryFilter);
    }

    if (priceSort !== "none") {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    const categoryLabel = categories.find(c => c.id.toLowerCase() === selectedCategory?.toLowerCase())?.label || selectedCategory;
    const subCategories = ["All", ...new Set(productList.filter(p => p.category === selectedCategory).map(p => p.subCategory).filter(Boolean))];

    return (
      <div className="space-y-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setActiveMartTab("home");
                setSubCategoryFilter("All");
                setPriceSort("none");
              }}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowDownLeft className="w-5 h-5 rotate-45" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-[#5A5A40]"><Translate>{categoryLabel}</Translate></h2>
              <p className="text-sm text-gray-500">{filteredProducts.length} <Translate>items available</Translate></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                className="text-xs font-bold bg-transparent focus:outline-none"
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
              >
                {subCategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <select 
                className="text-xs font-bold bg-transparent focus:outline-none"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
              >
                <option value="none">Sort Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
            {userRole === "farmer" && (
              <Button 
                onClick={() => {
                  setNewListing({...newListing, category: categoryLabel || "Crops"});
                  setIsSellModalOpen(true);
                }}
                className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold"
              >
                <Plus className="w-4 h-4 mr-2" /> <Translate>{`Sell ${categoryLabel}`}</Translate>
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input className="pl-10 w-full rounded-2xl border-gray-200 h-12" placeholder={`Search in ${categoryLabel}...`} />
        </div>

        {selectedCategory === "Nursery" && (
          <div className="bg-[#5A5A40]/5 p-4 rounded-2xl border border-[#5A5A40]/10">
            <p className="text-sm text-[#5A5A40] font-medium italic">
              "Nursery crops enable early-stage agricultural investment by providing ready-to-plant seedlings, reducing cultivation time and improving yield efficiency."
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all rounded-3xl overflow-hidden group relative">
              {product.isBestSeller && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-yellow-500 text-white border-none font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    BEST SELLER
                  </Badge>
                </div>
              )}
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3">
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="mb-2">
                  <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{product.rating}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">• {product.farmer}</span>
                  </div>
                </div>
                
                {product.scientificName && (
                  <p className="text-[10px] text-gray-400 italic mb-1">{product.scientificName}</p>
                )}

                <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>

                {product.category === "Nursery" && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Growth</p>
                      <p className="text-[10px] font-bold text-gray-700">{product.growthTime || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Water</p>
                      <p className="text-[10px] font-bold text-gray-700">{product.waterNeed || "N/A"}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider"><Translate>Price</Translate></p>
                    <p className="text-xl font-black text-[#5A5A40]">{product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => addToCart(product)}
                      className="rounded-xl border-gray-200 text-gray-500 hover:text-[#5A5A40] hover:border-[#5A5A40]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleAction(product.name, product.type === "rent" ? "Rent" : "Buy", product.price, { productId: product.id })}
                      className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl font-bold px-6 flex-1"
                    >
                      <Translate>{product.type === "rent" ? "Rent" : "Buy"}</Translate>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
                  <span><Translate>Stock</Translate>: {product.stock}</span>
                  <span className="text-green-600"><Translate>Verified Seller</Translate></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderHome = () => {
    const featuredPlants = productList.filter(p => p.category === "Nursery").slice(0, 6);
    const featuredNursery = productList.filter(p => p.category === "Nursery").slice(6, 8);
    const featuredMachinery = productList.filter(p => p.category === "Machinery").slice(0, 2);
    const featuredTools = productList.filter(p => p.category === "Tools").slice(0, 2);

    const ProductRow = ({ title, products, categoryId }: { title: string, products: any[], categoryId?: string }) => (
      <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <Button 
            variant="ghost" 
            className="text-blue-600 font-bold hover:bg-blue-50"
            onClick={() => {
              if (categoryId) {
                setSelectedCategory(categoryId);
                setActiveMartTab("category_view");
              }
            }}
          >
            <Translate>VIEW ALL</Translate>
          </Button>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer flex flex-col items-center text-center p-2 hover:shadow-md transition-shadow rounded-lg"
              onClick={() => handleAction(product.name, product.type === "rent" ? "Rent" : "Buy", product.price, { productId: product.id })}
            >
              <div className="aspect-square w-full relative mb-3 overflow-hidden rounded-lg bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600">{product.name}</h4>
              <p className="text-sm font-bold text-green-700 mt-1">{product.price}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{product.subCategory || product.category}</p>
            </div>
          ))}
        </div>
      </section>
    );

    const SmallProductRow = ({ title, products, categoryId }: { title: string, products: any[], categoryId?: string }) => (
      <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex-1">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 font-bold hover:bg-blue-50"
            onClick={() => {
              if (categoryId) {
                setSelectedCategory(categoryId);
                setActiveMartTab("category_view");
              }
            }}
          >
            <Translate>VIEW ALL</Translate>
          </Button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer flex flex-col items-center text-center p-2 hover:shadow-sm transition-shadow rounded-lg border border-gray-50"
              onClick={() => handleAction(product.name, product.type === "rent" ? "Rent" : "Buy", product.price, { productId: product.id })}
            >
              <div className="aspect-square w-full relative mb-2 overflow-hidden rounded-lg bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-xs font-medium text-gray-800 line-clamp-1">{product.name}</h4>
              <p className="text-xs font-bold text-green-700 mt-1">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    );

    return (
      <div className="space-y-6 pb-24 bg-gray-50 -mx-4 px-4 pt-4">
        {/* Search & Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-[#5A5A40] tracking-tight">AgroMart <span className="text-blue-600">Plus</span></h2>
            <p className="text-sm text-gray-500 font-medium"><Translate>India's Trusted Agricultural Marketplace</Translate></p>
          </div>
          <div className="flex gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input className="pl-10 w-full rounded-xl border-gray-200 bg-gray-50 h-11 focus:bg-white transition-colors" placeholder="Search for crops, plants, tools..." />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 relative h-11 shadow-lg shadow-blue-600/20">
              <ShoppingCart className="w-5 h-5 mr-2" />
              <Translate>Cart</Translate>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </section>

        {/* Categories Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button 
                key={cat.id} 
                onClick={() => {
                  setSelectedCategory(cat.label);
                  setActiveMartTab("category_view");
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 hover:border-blue-600 hover:text-blue-600 transition-all whitespace-nowrap shrink-0 group"
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                <span className="font-bold text-sm text-gray-700 group-hover:text-blue-600"><Translate>{cat.label}</Translate></span>
              </button>
            );
          })}
        </div>

        {/* Featured 6 Plants (Flipkart Style) */}
        <ProductRow title="Featured 6 Plants" products={featuredPlants} categoryId="Nursery" />

        {/* Small Rows Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          <SmallProductRow title="Featured Nursery" products={featuredNursery} categoryId="Nursery" />
          <SmallProductRow title="Featured Machinery" products={featuredMachinery} categoryId="Machinery" />
          <SmallProductRow title="Featured Tools" products={featuredTools} categoryId="Tools" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 text-white p-3 rounded-2xl">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-orange-900"><Translate>Unable to plant?</Translate></h4>
                <p className="text-sm text-orange-700"><Translate>Resell your saplings or equipment instantly to avoid loss.</Translate></p>
              </div>
              <Button 
                onClick={() => handleAction("Saplings", "Sell", "₹500")}
                className="ml-auto bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold"
              >
                <Translate>Resell Now</Translate>
              </Button>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900"><Translate>Earn from your gear</Translate></h4>
                <p className="text-sm text-blue-700"><Translate>List your machinery or farm for rent to fellow farmers.</Translate></p>
              </div>
              <Button 
                onClick={() => handleAction("Tractor", "Rent", "₹1,500")}
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                <Translate>List for Rent</Translate>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#5A5A40]"><Translate>Bookings & Orders</Translate></h2>
        <Badge variant="outline" className="rounded-full px-4 py-1 border-[#5A5A40] text-[#5A5A40] font-bold">
          {orders.length} <Translate>Total</Translate>
        </Badge>
      </div>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setOrderFilter}>
        <TabsList className="w-full bg-white p-1 rounded-2xl border border-gray-100 h-14">
          <TabsTrigger value="pending" className="flex-1 rounded-xl data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white font-bold">
            <Translate>Pending</Translate>
          </TabsTrigger>
          <TabsTrigger value="Paid" className="flex-1 rounded-xl data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white font-bold">
            <Translate>Paid</Translate>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 rounded-xl data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white font-bold">
            <Translate>Completed</Translate>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          {orders.filter(o => o.status === orderFilter).map((order) => (
            <Card key={order.id} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    order.status === "pending" ? "bg-orange-100 text-orange-600" :
                    order.status === "Paid" ? "bg-blue-100 text-blue-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {order.status === "pending" ? <Clock className="w-6 h-6" /> :
                     order.status === "Paid" ? <TrendingUp className="w-6 h-6" /> :
                     <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{order.item}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{order.id.slice(0, 8)} • {order.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[#5A5A40]">{order.amount}</p>
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase",
                    order.status === "pending" ? "bg-orange-500" :
                    order.status === "Paid" ? "bg-blue-500" :
                    order.status === "completed" ? "bg-green-500" : "bg-red-500"
                  )}>
                    <Translate>{order.status}</Translate>
                  </Badge>
                </div>
              </div>
              {order.status === "pending" && (
                <div className="px-6 pb-6 flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => cancelOrder(order.id)}
                    className="flex-1 rounded-xl border-red-100 text-red-500 hover:bg-red-50 font-bold"
                  >
                    <Translate>Cancel</Translate>
                  </Button>
                  <Button className="flex-1 bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold">
                    <Translate>Track Order</Translate>
                  </Button>
                </div>
              )}
            </Card>
          ))}
          {orders.filter(o => o.status === orderFilter).length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold"><Translate>No orders in this category</Translate></p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6 pb-24">
      <Card className="bg-[#5A5A40] text-white border-none rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2"><Translate>Total Balance</Translate></p>
          <h2 className="text-4xl font-black mb-6">₹{balance.toLocaleString()}</h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => handleAction("Wallet", "Deposit", "₹1,000")}
              className="bg-white text-[#5A5A40] hover:bg-white/90 rounded-xl font-bold px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> <Translate>Add Money</Translate>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("Wallet", "Withdraw", "₹1,000")}
              className="border-white/20 text-white hover:bg-white/10 rounded-xl font-bold px-6"
            >
              <Translate>Withdraw</Translate>
            </Button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-[#5A5A40]"><Translate>Recent Transactions</Translate></h3>
        {transactions.map((txn) => (
          <Card key={txn.id} className="border-none shadow-sm bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-xl",
                  txn.type === "in" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {txn.type === "in" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{txn.label}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{txn.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              </div>
              <p className={cn(
                "font-black",
                txn.type === "in" ? "text-green-600" : "text-red-600"
              )}>
                {txn.type === "in" ? "+" : "-"}{txn.amount}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFarmerDashboard = () => (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>Farmer Dashboard</Translate></h2>
        <Button className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" /> <Translate>Add Product</Translate>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
              <BadgeIndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Total Earnings</Translate></p>
              <h3 className="text-2xl font-black text-gray-900">₹0</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>0% <Translate>from last month</Translate></span>
          </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Products Listed</Translate></p>
              <h3 className="text-2xl font-black text-gray-900">{dbProducts.length}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
            <Plus className="w-4 h-4" />
            <span><Translate>Active listings</Translate></span>
          </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Market Demand</Translate></p>
              <h3 className="text-2xl font-black text-gray-900"><Translate>Stable</Translate></h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-600 text-xs font-bold">
            <LineChart className="w-4 h-4" />
            <span><Translate>Market is stable</Translate></span>
          </div>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 p-6">
          <CardTitle className="text-lg font-bold text-[#5A5A40]"><Translate>Market Prediction</Translate></CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center py-12 text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold"><Translate>No market predictions available</Translate></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVendorDashboard = () => (
    <div className="space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#5A5A40]"><Translate>Vendor Dashboard</Translate></h2>
        <Button className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl font-bold">
          <Plus className="w-4 h-4 mr-2" /> <Translate>List Equipment</Translate>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Rental Earnings</Translate></p>
              <h3 className="text-2xl font-black text-gray-900">₹0</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>0% <Translate>this week</Translate></span>
          </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Active Bookings</Translate></p>
              <h3 className="text-2xl font-black text-gray-900">0</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span><Translate>No active bookings</Translate></span>
          </div>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider"><Translate>Equipment Status</Translate></p>
              <h3 className="text-2xl font-black text-gray-900">100%</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-yellow-600 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span><Translate>Ready for listing</Translate></span>
          </div>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#5A5A40]"><Translate>My Equipment</Translate></CardTitle>
          <Button variant="ghost" size="sm" className="text-[#5A5A40] font-bold"><Translate>Manage All</Translate></Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {[].length > 0 ? [].map((item: any, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Tractor className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={cn(
                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase",
                    item.status === "Available" ? "bg-green-500" : "bg-blue-500"
                  )}>
                    <Translate>{item.status}</Translate>
                  </Badge>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{item.user}</p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-400">
                <Tractor className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold"><Translate>No equipment listed yet</Translate></p>
                <p className="text-xs mt-1"><Translate>Click 'List Equipment' to start earning</Translate></p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#5A5A40]"><Translate>Notifications</Translate></h2>
        <Button 
          variant="ghost" 
          onClick={markAllRead}
          className="text-[#5A5A40] text-xs font-bold"
        >
          <Translate>Mark all as read</Translate>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 h-12 mb-6">
          <TabsTrigger value="all" className="flex-1 rounded-xl data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white font-bold">
            <Translate>All</Translate>
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1 rounded-xl data-[state=active]:bg-[#5A5A40] data-[state=active]:text-white font-bold">
            <Translate>Unread</Translate>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className={cn(
              "border-none shadow-sm rounded-2xl p-4 transition-colors",
              n.unread ? "bg-white border-l-4 border-l-[#5A5A40]" : "bg-gray-50/50"
            )}>
              <div className="flex gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  n.unread ? "bg-[#5A5A40]/10 text-[#5A5A40]" : "bg-gray-200 text-gray-400"
                )}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                    <span className="text-[10px] text-gray-400 font-bold">{n.createdAt?.toDate().toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="unread" className="space-y-3">
          {notifications.filter(n => n.unread).map((n) => (
            <Card key={n.id} className="border-none shadow-sm rounded-2xl p-4 bg-white border-l-4 border-l-[#5A5A40]">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                    <span className="text-[10px] text-gray-400 font-bold">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-120px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMartTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeMartTab === "home" && renderHome()}
          {activeMartTab === "category_view" && renderCategoryView()}
          {activeMartTab === "orders" && renderOrders()}
          {activeMartTab === "wallet" && renderWallet()}
          {activeMartTab === "notifications" && renderNotifications()}
          {activeMartTab === "farmer_dashboard" && renderFarmerDashboard()}
          {activeMartTab === "vendor_dashboard" && renderVendorDashboard()}
        </motion.div>
      </AnimatePresence>

      {renderSellModal()}
      {renderPaymentModal()}

      {/* Floating Action Button for Farmers */}
      {userRole === "farmer" && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSellModalOpen(true)}
          className="fixed right-6 bottom-24 w-14 h-14 bg-[#5A5A40] text-white rounded-full shadow-2xl flex items-center justify-center z-40 md:right-12"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => setActiveMartTab("home")}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeMartTab === "home" ? "text-[#5A5A40]" : "text-gray-400"
            )}
          >
            <Home className={cn("w-6 h-6", activeMartTab === "home" && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Home</Translate></span>
          </button>
          
          {userRole === "farmer" && (
            <button 
              onClick={() => setActiveMartTab("farmer_dashboard")}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeMartTab === "farmer_dashboard" ? "text-[#5A5A40]" : "text-gray-400"
              )}
            >
              <BarChart3 className={cn("w-6 h-6", activeMartTab === "farmer_dashboard" && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Farmer</Translate></span>
            </button>
          )}

          {userRole === "vendor" && (
            <button 
              onClick={() => setActiveMartTab("vendor_dashboard")}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeMartTab === "vendor_dashboard" ? "text-[#5A5A40]" : "text-gray-400"
              )}
            >
              <Store className={cn("w-6 h-6", activeMartTab === "vendor_dashboard" && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Vendor</Translate></span>
            </button>
          )}

          <button 
            onClick={() => setActiveMartTab("orders")}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeMartTab === "orders" ? "text-[#5A5A40]" : "text-gray-400"
            )}
          >
            <ClipboardList className={cn("w-6 h-6", activeMartTab === "orders" && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Orders</Translate></span>
          </button>
          <button 
            onClick={() => setActiveMartTab("wallet")}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeMartTab === "wallet" ? "text-[#5A5A40]" : "text-gray-400"
            )}
          >
            <Wallet className={cn("w-6 h-6", activeMartTab === "wallet" && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Wallet</Translate></span>
          </button>
          <button 
            onClick={() => setActiveMartTab("notifications")}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeMartTab === "notifications" ? "text-[#5A5A40]" : "text-gray-400"
            )}
          >
            <div className="relative">
              <Bell className={cn("w-6 h-6", activeMartTab === "notifications" && "scale-110")} />
              {notifications.some(n => n.unread) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter"><Translate>Alerts</Translate></span>
          </button>
        </div>
      </div>
    </div>
  );
}
