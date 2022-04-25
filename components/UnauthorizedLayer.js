import Link from "next/link";

const UnauthorizedLayer = ({ children }) => {
  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          position: "absolute",
          borderBottom: "1px solid #f2f3f4",
        }}
      >
        <h3>iManage</h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gridGap: "16px",
          }}
        >
          <Link href={"/about-us"}>About Us</Link>
          <Link href={"/contact-us"}>Contact Us</Link>
          <Link href={"/auth/login"}>Login / Signup</Link>
        </div>
      </div>

      <div
        style={{
          padding: "64px 0px",
          height: "100vh",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default UnauthorizedLayer;
