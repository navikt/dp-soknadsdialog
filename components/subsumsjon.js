export default function Subsumsjon({ navn, children = [] }) {
  console.log(children);
  return (
    <div data-testid="subsumsjon">
      {navn}
      {!!children.length && (
        <ul>
          {children.map((child) => (
            <li key={child.name}>{child}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
