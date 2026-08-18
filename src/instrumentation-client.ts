/**
 * Filtre un bug connu de React Developer Tools (extension Chrome) :
 * « The children should not have changed if we pass in the same set. »
 * Sans effet en production — l’app n’est pas en cause.
 */
if (process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const text = args
      .map((arg) => {
        if (typeof arg === "string") return arg;
        if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
        return "";
      })
      .join(" ");

    if (
      text.includes("React instrumentation encountered an error") ||
      text.includes("The children should not have changed if we pass in the same set") ||
      text.includes("gpphkfbcpidddadnkolkpfckpihlkkil")
    ) {
      return;
    }

    originalError.apply(console, args);
  };
}
