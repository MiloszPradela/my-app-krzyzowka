import Link from "next/link";
function notFound() {
  return (
    <>
      <h1>ERROR 404</h1>
      <Link href="/"><button className="btn btn-outline btn-primary">Wróć na stronę główną</button></Link>
    </>
  );
}

export default notFound;
