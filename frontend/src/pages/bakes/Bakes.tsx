import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Croissant, Clock } from "lucide-react"

const Bakes = () => {
    return (
        <div className="flex items-center justify-center p-4 bg-amber-50/50">
            <Card className="w-full max-w-md text-center border-amber-200">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <Croissant className="h-6 w-6 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-amber-900">Fresh Bakes Coming Soon!</h2>
                    <p className="text-amber-800/80">
                        Our oven is heating up! We're preparing delicious bakery items that will be available soon.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
                        <Clock className="h-4 w-4" />
                        <span>Expected launch: May 2025</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700" disabled>
                        Get Early Access
                    </Button>
                    <Button variant="outline" className="w-full text-amber-800 border-amber-300" disabled>
                        View Breakfast Menu
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Bakes