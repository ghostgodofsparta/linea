const items = [
  'Effortless Style', 'New Season', 'Mediterranean Craft',
  'Sustainable Fabrics', 'Free Shipping Over €120',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {doubled.map((text, i) => (
          <span className="marquee-item" key={i}>
            {text} <span>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
