import ServiceCard from "@/components/ServiceCard";
import { Clock, Store, DollarSign, ShieldCheck, MapPin, Zap, Truck, CheckCircle } from "lucide-react";

const Home = () => {
    return (
        <main className="flex flex-col items-center px-4 md:px-8 lg:px-16 py-12 space-y-16">
            {/* Hero Section */}
            <section className="text-center max-w-4xl">
                <h1 className="text-4xl font-extrabold text-gray-900">Fast & Fresh Delivery Services</h1>
                <p className="text-lg text-gray-600 mt-4">Delivering food, groceries, and bakery items straight to your doorstep with speed and reliability.</p>
            </section>

            {/* Services Section */}
            <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Food Delivery", description: "Order from your favorite restaurants and enjoy hot meals.", path: "restaurants", icon: <Truck /> },
                    { title: "Grocery Delivery", description: "Get fresh groceries delivered quickly to your home.", path: "grocery", icon: <Store /> },
                    { title: "Bakery Items", description: "Delicious cakes, pastries, and more delivered to you.", path: "bakes", icon: <CheckCircle /> }
                ].map(({ title, description, path, icon }, index) => (
                    <ServiceCard key={index} title={title} description={description} path={path} icon={icon} />
                ))}
            </section>

            {/* Why Choose Us Section */}
            <section className="text-center max-w-6xl">
                <h2 className="text-3xl font-semibold text-gray-900">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                    {[
                        { icon: <Clock />, title: "24/7 Delivery Service", description: "Order anytime, anywhere, and get your essentials delivered." },
                        { icon: <Store />, title: "Wide Range of Stores", description: "Choose from top-rated restaurants and grocery stores." },
                        { icon: <DollarSign />, title: "Affordable Pricing", description: "Best prices with exciting offers and discounts." },
                        { icon: <ShieldCheck />, title: "Secure Payments", description: "Multiple payment options with end-to-end encryption." }
                    ].map(({ icon, title, description }, index) => (
                        <div key={index} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3">
                            <div className="text-primary flex items-center space-x-2">{icon}<h3 className="font-semibold text-lg">{title}</h3></div>
                            <p className="text-gray-600 text-sm">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Fastest Delivery Guaranteed Section */}
            <section className="w-full max-w-6xl bg-gray-100 p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-semibold text-gray-900">Fastest Delivery Guaranteed!</h2>
                <p className="text-gray-700 mt-4">We deliver your food, groceries, and essentials within minutes. No delays, no hassles!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {[
                        { icon: <MapPin />, title: "Track Your Order", description: "Stay updated with real-time tracking and notifications." },
                        { icon: <Zap />, title: "Lightning Fast Delivery", description: "Our optimized delivery system ensures you get your order in no time." }
                    ].map(({ icon, title, description }, index) => (
                        <div key={index} className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3">
                            <div className="text-primary flex items-center space-x-2">{icon}<h3 className="text-lg font-semibold">{title}</h3></div>
                            <p className="text-gray-600 text-sm">{description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
