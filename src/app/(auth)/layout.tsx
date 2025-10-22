interface Props{
    children:React.ReactNode;
}

const Layout = ({children}:Props) =>{
    return (
        <div className="bg-[radial-gradient(circle_at_center,_#DED1B6_0%,_#484848_50%,_#000000_100%)] flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl ">
            {children}
        </div>
    </div>
    )
}
export default Layout;