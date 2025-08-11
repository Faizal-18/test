import './index.css'
import React, { useState } from 'react';
import Card from './components/common/Card';
import AIAssistant from './components/AIAssistant';
import GardenPlanner from './components/GardenPlanner';
import { MOCK_PRODUCTS, MOCK_EXPERTS, LeafIcon, SparklesIcon, ChatBubbleIcon, HouseIcon, SunIcon } from './constants';
import type { Product, Expert } from './types';

type View = 'dashboard' | 'assistant' | 'planner';

const Header: React.FC<{ activeView: View; setView: (view: View) => void }> = ({ activeView, setView }) => {
    const NavButton: React.FC<{
        viewName: View;
        icon: React.ReactNode;
        children: React.ReactNode;
    }> = ({ viewName, icon, children }) => (
        <button
            onClick={() => setView(viewName)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeView === viewName ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-primary-light/50'
            }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );

    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        <LeafIcon className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-gray-800">Rooftop Garden Oasis</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                        <NavButton viewName="dashboard" icon={<HouseIcon className="w-5 h-5" />}>Dashboard</NavButton>
                        <NavButton viewName="planner" icon={<SparklesIcon className="w-5 h-5" />}>AI Planner</NavButton>
                        <NavButton viewName="assistant" icon={<ChatBubbleIcon className="w-5 h-5" />}>Ask Sprout</NavButton>
                    </div>
                </div>
            </nav>
        </header>
    );
};


const Dashboard: React.FC = () => {
    return (
        <div className="space-y-16 py-12">
             <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Your <span className="text-primary">Urban Jungle</span> Awaits
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Everything you need to transform your rooftop into a thriving green sanctuary.
                </p>
             </section>

            <Section title="Featured Products" subtitle="Top picks for your rooftop garden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MOCK_PRODUCTS.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            </Section>

            <Section title="Consult an Expert" subtitle="Get personalized advice from seasoned agri-experts">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_EXPERTS.map(expert => <ExpertCard key={expert.id} expert={expert} />)}
                </div>
            </Section>
        </div>
    );
};

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <section>
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-md text-gray-500">{subtitle}</p>
        </div>
        {children}
    </section>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card className="group">
        <div className="aspect-w-16 aspect-h-9">
            <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="p-4">
            <p className="text-sm font-medium text-primary">{product.category}</p>
            <h3 className="mt-1 font-semibold text-lg text-gray-800 group-hover:text-primary-dark transition-colors">{product.name}</h3>
            <p className="mt-2 text-gray-700">{product.price}</p>
        </div>
    </Card>
);

const ExpertCard: React.FC<{ expert: Expert }> = ({ expert }) => (
    <Card className="text-center group">
         <div className="p-6">
            <img className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white group-hover:ring-primary-light transition-all duration-300" src={expert.imageUrl} alt={expert.name} />
            <h3 className="mt-4 font-bold text-xl text-gray-800">{expert.name}</h3>
            <p className="text-primary font-medium">{expert.specialty}</p>
            <p className="mt-2 text-gray-600">{expert.rate}</p>
             <button className="mt-4 w-full bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark/90 transition-colors">
                Book Consult
            </button>
        </div>
    </Card>
);


const Footer: React.FC = () => (
    <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} Rooftop Garden Oasis. Your partner in urban farming.</p>
        </div>
    </footer>
);


const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard />;
            case 'assistant':
                return <AIAssistant />;
            case 'planner':
                return <GardenPlanner />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header activeView={view} setView={setView} />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
