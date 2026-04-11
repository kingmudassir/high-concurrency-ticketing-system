interface Featureprops {
    icon: React.ReactNode,
    title: string,
    description: string
}

export default async function Cards_for_features({icon, title, description}: Featureprops) {
  return (
    <div className="flex flex-col space-y-3 border border-gray-200 rounded-3xl px-5 py-7">
        <span className="text-4xl mb-7">
            {icon}
        </span>
        <span className="text-xl font-bold">
            {title}
        </span>
        <span className="text-gray-600">
            {description}
        </span>
    </div>
  )
}