import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100 font-sans">
            <div className="relative flex flex-col items-center justify-center max-w-[1000px] w-screen max-h-[675px] h-screen bg-primary-foreground rounded-2xl p-4">

                <Button variant="default" size={"lg"} >
                    <Link href={"/upload"}>{"Start"}</Link>
                </Button>
                <div className="absolute bottom-2 text-sm text-secondary-foreground">
                    Need help? Read the <Button variant={"link"}  className={"px-0"}><Link href={"/documentation"}>{"documentation"}</Link></Button>.
                </div>

            </div>
        </div>
    );
}