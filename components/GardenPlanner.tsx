
import React, { useState } from 'react';
import { generateGardenPlan } from '../services/geminiService';
import type { GardenPlan } from '../types';
import Spinner from './common/Spinner';
import { SparklesIcon, LeafIcon } from '../constants';

const GardenPlanner: React.FC = () => {
    const [formData, setFormData] = useState({
        size: '10x12 ft',
        sunlight: '6-8 hours (Full Sun)',
        location: 'New York, USA',
        preference: 'low-maintenance and edible plants',
    });
    const [plan, setPlan] = useState<GardenPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setPlan(null);

        try {
            const response = await generateGardenPlan(
                formData.size,
                formData.sunlight,
                formData.location,
                formData.preference
            );
            const jsonText = response.text.trim();
            const parsedPlan = JSON.parse(jsonText);
            setPlan(parsedPlan);
        } catch (err) {
            console.error("Failed to generate plan:", err);
            setError("Sorry, we couldn't generate a plan. The creative bots might be resting. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <SparklesIcon className="w-12 h-12 mx-auto text-primary" />
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    AI Rooftop Garden Planner
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Describe your space and let our AI craft a personalized garden design just for you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">Terrace Size</label>
                        <input type="text" name="size" id="size" value={formData.size} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="sunlight" className="block text-sm font-medium text-gray-700">Sunlight Exposure</label>
                        <select id="sunlight" name="sunlight" value={formData.sunlight} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>Less than 4 hours (Shade)</option>
                            <option>4-6 hours (Partial Sun)</option>
                            <option>6-8 hours (Full Sun)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Your Location (City, Country)</label>
                        <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="preference" className="block text-sm font-medium text-gray-700">I'd love a garden that is...</label>
                        <input type="text" name="preference" id="preference" value={formData.preference} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:bg-gray-400 transition-colors">
                            {isLoading ? 'Designing...' : 'Generate My Plan'}
                        </button>
                    </div>
                </form>

                <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl shadow-lg p-8 text-white min-h-[400px] flex flex-col justify-center">
                    {isLoading && <Spinner />}
                    {error && <p className="text-center text-yellow-300">{error}</p>}
                    {plan && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-green-200">Theme</p>
                                <h3 className="text-3xl font-bold text-white">{plan.theme}</h3>
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-green-200">Layout Idea</p>
                                <p className="text-green-100 mt-1">{plan.layout_description}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider text-green-200">Plant Suggestions</p>
                                <ul className="mt-2 space-y-3">
                                    {plan.plants.map((plant, index) => (
                                        <li key={index} className="bg-white/20 p-3 rounded-lg">
                                            <p className="font-semibold text-white">{plant.name}</p>
                                            <p className="text-sm text-green-100 italic">"{plant.reason}"</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    {!isLoading && !plan && !error && (
                        <div className="text-center">
                            <LeafIcon className="w-16 h-16 mx-auto text-white/50" />
                            <p className="mt-4 text-lg text-green-200">Your personalized garden plan will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GardenPlanner;
