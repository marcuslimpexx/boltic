export default function NotFound() {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif", backgroundColor: "#FAFAFA" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#0A0A0A",
          }}
        >
          <h1 style={{ fontSize: "4rem", fontWeight: 700, margin: 0 }}>404</h1>
          <p style={{ marginTop: "0.5rem", color: "#737373" }}>
            Trang không tồn tại
          </p>
          <a
            href="/vi"
            style={{ marginTop: "1.5rem", color: "#3D2BFF", textDecoration: "none" }}
          >
            ← Về trang chủ
          </a>
        </main>
      </body>
    </html>
  );
}
