import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { MoveRight } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    path: string;
}

const ServiceCard = ({ title, description, path }: Props) => {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link to={path}><Button className="cursor-pointer" size="default">{path.charAt(0).toUpperCase() + path.slice(1)} <MoveRight /></Button></Link>
            </CardFooter>
        </Card>
    )
}

export default ServiceCard