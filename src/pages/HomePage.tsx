import { memo } from "react";

export const HomePage = memo(() => {
    return <h1>Home</h1>;
});

HomePage.displayName = "HomePage";

export default HomePage;
