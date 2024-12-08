const Topbar = () => {
    return (
        <div className="bg-background-dark px-6 py-4 flex justify-between items-center shadow-lg rounded-md">
            {/* Logo Section */}
            <div className="text-2xl text-accent font-extrabold flex items-center">
                Ca<span className="text-primary">sino</span>
            </div>

            {/* Balance Information */}
            <div className="flex flex-col text-right">
                <div className="text-text-light text-sm font-medium">
                    Deposit Balance: <span className="text-primary font-bold">300 TK</span>
                </div>
                <div className="text-text-light text-sm font-medium">
                    Winning Balance: <span className="text-secondary font-bold">500 TK</span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
