// Renders a schema.org object as an application/ld+json script tag.
// `</script>` is escaped so a value containing it can't break out of the tag.
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
