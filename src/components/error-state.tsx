import { AlertCircleIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export const ErrorState = ({ title, description }: Props) => {
    return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
            <AlertCircleIcon className="h-10 w-10 text-destructive" />
            <div className="flex flex-col gap-y-2 text-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div> 
        </div>
    </div>
    );
}