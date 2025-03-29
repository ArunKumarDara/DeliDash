import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

const Grocery = () => {
    return (
        <div className="flex items-center justify-center  p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Construction className="h-6 w-6 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Grocery Feature Coming Soon!</h2>
                    <p className="text-muted-foreground">
                        We're working hard to bring you an amazing grocery shopping experience.
                        Stay tuned for updates!
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full" disabled>
                        Notify Me When Available
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                        Browse Restaurants
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Grocery;