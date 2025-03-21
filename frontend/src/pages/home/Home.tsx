import ServiceCard from "@/components/ServiceCard"

const Home = () => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center">
            <section className="max-w-5xl text-center">
                <h1 className="text-3xl font-bold">Fast & Fresh Delivery Services</h1>
                <p className="text-muted-foreground mt-2">Delivering food, groceries, and bakery items to your doorstep.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <ServiceCard title="Food Delivery" description="Order from your favorite restaurants and enjoy hot meals." path="restaurants" />
                    <ServiceCard title="Grocery Delivery" description="Get fresh groceries delivered quickly to your home." path="grocery" />
                    <ServiceCard title="Bakery Items" description="Delicious cakes, pastries, and more delivered to you." path="bakes" />
                </div>
            </section>
            <section className="mt-16 max-w-5xl text-center">
                <h2 className="text-3xl font-semibold">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">24/7 Delivery Service</h3>
                        <p className="mt-2 text-gray-600">Order anytime, anywhere, and get your essentials delivered.</p>
                    </div>
                    <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Wide Range of Stores</h3>
                        <p className="mt-2 text-gray-600">Choose from top-rated restaurants and grocery stores.</p>
                    </div>
                    <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Affordable Pricing</h3>
                        <p className="mt-2 text-gray-600">Best prices with exciting offers and discounts.</p>
                    </div>
                    <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">Secure Payments</h3>
                        <p className="mt-2 text-gray-600">Multiple payment options with end-to-end encryption.</p>
                    </div>
                </div>
            </section>
            <section className="mt-16 max-w-5xl text-center bg-white text-gray-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold">Fastest Delivery Guaranteed!</h2>
                <p className="mt-2 text-gray-700">We deliver your food, groceries, and essentials within minutes. No delays, no hassles!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h3 className="text-xl font-semibold">Track Your Order</h3>
                        <p className="mt-2 text-gray-600">Stay updated with real-time tracking and notifications.</p>
                    </div>
                    <div className="p-6 bg-gray-100 rounded-lg shadow">
                        <h3 className="text-xl font-semibold">Lightning Fast Delivery</h3>
                        <p className="mt-2 text-gray-600">Our optimized delivery system ensures you get your order in no time.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home