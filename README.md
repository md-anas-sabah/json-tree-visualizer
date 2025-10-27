# JSON Tree Visualizer

An interactive web application built with Next.js that visualizes JSON data as an intuitive tree structure. Perfect for exploring complex JSON objects, debugging API responses, and understanding nested data hierarchies.

## Features

- **Interactive Tree Visualization**: Transform JSON data into an easy-to-navigate tree diagram using ReactFlow
- **JSON Input Editor**: Built-in text area with syntax validation and helpful error messages
- **Search Functionality**: Search through your JSON tree to quickly locate specific paths
- **Download Visualization**: Export your tree diagram as an image (PNG format)
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Sample Data Included**: Get started quickly with pre-loaded example JSON

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with React 19
- **Visualization**: [ReactFlow](https://reactflow.dev) for interactive tree diagrams
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for responsive design
- **Language**: TypeScript for type safety
- **Image Export**: html-to-image and dom-to-image libraries

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Usage

1. **Enter JSON Data**: Paste your JSON into the left panel or modify the sample data
2. **Generate Tree**: Click the "Generate Tree" button to visualize your data
3. **Explore**: Navigate through the interactive tree diagram
4. **Search**: Use the search feature to find specific paths in your JSON
5. **Download**: Export the visualization as an image
6. **Toggle Theme**: Switch between light and dark modes using the theme toggle
7. **Clear/Reset**: Clear all data and start fresh

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme support
│   └── page.tsx            # Main application page
├── components/
│   ├── JsonInput.tsx       # JSON input editor component
│   ├── JsonTreeVisualizer.tsx  # Tree visualization component
│   ├── CustomNode.tsx      # Custom tree node component
│   └── ThemeToggle.tsx     # Dark mode toggle component
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [ReactFlow Documentation](https://reactflow.dev/docs) - learn about building node-based UIs
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS

## Deploy on Vercel

The easiest way to deploy this app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/my-next-app)

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
