import Image from "next/image";

interface Props {
    title: string;
    description: string;
}

export const EmptyState = ({ title, description }: Props) => {
    return (
    <div className="py-4 px-8 flex flex-col items-center justify-center">
            <Image src="/empty.svg" alt="Empty" width={240} height={240} />
            <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div> 

    </div>
    );
}