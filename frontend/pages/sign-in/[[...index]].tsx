// Disable static generation
export const getServerSideProps = () => {
  return { props: {} };
};

export default function SignInPage() {
  try {
    const { SignIn } = require("@clerk/nextjs");
    return <SignIn />;
  } catch (e) {
    return <div>Authentication not configured. Please set up Clerk.</div>;
  }
}
