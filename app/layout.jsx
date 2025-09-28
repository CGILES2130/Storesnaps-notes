export const metadata = {
  title: "StoreSnap Notes",
  description: "Store visit notes with photos, PDF export, and email attachments",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
