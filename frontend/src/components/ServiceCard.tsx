import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { MoveRight } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    path: string;
    icon: React.ReactNode
}

const ServiceCard = ({ title, description, path, icon }: Props) => {
    return (
        <Card className="border-0 shadow-md flex flex-col items-center text-center p-4">
            <CardHeader className="flex items-center gap-2 w-full justify-center">
                <div className="text-primary">{icon}</div>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link to={path}>
                    <Button className="cursor-pointer flex items-center gap-2">
                        {path.charAt(0).toUpperCase() + path.slice(1)} <MoveRight />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ServiceCard;
