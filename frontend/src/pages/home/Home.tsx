import ServiceCard from "@/components/ServiceCard";
import { Clock, Store, DollarSign, ShieldCheck, MapPin, Zap, Truck, CheckCircle } from "lucide-react";

const Home = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center">
            <section className="max-w-6xl text-center">
                <h1 className="text-3xl font-bold">Fast & Fresh Delivery Services</h1>
                <p className="text-muted-foreground mt-2">Delivering food, groceries, and bakery items to your doorstep.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <ServiceCard title="Food Delivery" description="Order from your favorite restaurants and enjoy hot meals." path="restaurants" icon={<Truck />} />
                    <ServiceCard title="Grocery Delivery" description="Get fresh groceries delivered quickly to your home." path="grocery" icon={<Store />} />
                    <ServiceCard title="Bakery Items" description="Delicious cakes, pastries, and more delivered to you." path="bakes" icon={<CheckCircle />} />
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="mt-16 max-w-6xl text-center">
                <h2 className="text-3xl font-semibold">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {[
                        { icon: <Clock />, title: "24/7 Delivery Service", description: "Order anytime, anywhere, and get your essentials delivered." },
                        { icon: <Store />, title: "Wide Range of Stores", description: "Choose from top-rated restaurants and grocery stores." },
                        { icon: <DollarSign />, title: "Affordable Pricing", description: "Best prices with exciting offers and discounts." },
                        { icon: <ShieldCheck />, title: "Secure Payments", description: "Multiple payment options with end-to-end encryption." }
                    ].map(({ icon, title, description }, index) => (
                        <div key={index} className="p-6 bg-white text-gray-900 rounded-lg shadow-lg flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                {icon}
                                <h3 className="font-semibold">{title}</h3>
                            </div>
                            <p className="mt-2 text-gray-600">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Fastest Delivery Guaranteed Section */}
            <section className="mt-16 max-w-6xl text-center bg-white text-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold">Fastest Delivery Guaranteed!</h2>
                <p className="mt-2 text-gray-700">We deliver your food, groceries, and essentials within minutes. No delays, no hassles!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {[
                        { icon: <MapPin />, title: "Track Your Order", description: "Stay updated with real-time tracking and notifications." },
                        { icon: <Zap />, title: "Lightning Fast Delivery", description: "Our optimized delivery system ensures you get your order in no time." }
                    ].map(({ icon, title, description }, index) => (
                        <div key={index} className="p-6 bg-gray-100 rounded-lg shadow flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                {icon}
                                <h3 className="text-xl font-semibold">{title}</h3>
                            </div>
                            <p className="mt-2 text-gray-600">{description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
