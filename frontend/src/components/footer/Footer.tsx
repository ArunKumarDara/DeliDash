import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-zinc-100">
            {/* Main Footer Content */}
            <div className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Dine-Express</h3>
                        <p className="text-sm text-zinc-400">
                            Delivering happiness to your doorstep. Experience the best food delivery service in your city.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Partner with Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Refund Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3 text-sm text-zinc-400">
                                <MapPin className="h-4 w-4" />
                                <span>123 Main Street, City, State 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-zinc-400">
                                <Phone className="h-4 w-4" />
                                <span>+91 1234567890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-zinc-400">
                                <Mail className="h-4 w-4" />
                                <span>support@dine-express.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-zinc-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-zinc-400">
                            &copy; {new Date().getFullYear()} Dine-Express. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <img src="/payment/visa.svg" alt="Visa" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
                            <img src="/payment/mastercard.svg" alt="Mastercard" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
                            <img src="/payment/paypal.svg" alt="PayPal" className="h-8 opacity-75 hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;