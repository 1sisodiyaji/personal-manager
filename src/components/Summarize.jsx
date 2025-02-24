import React, { useState } from 'react';
import axios from 'axios';
const Summarizer = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [crucialPoints, setCrucialPoints] = useState([]);


    const handleSummarize = async () => {

        if (!text.trim()) return alert('Please enter text to summarize');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.VITE_APP_BACKEND_URL}/api/summarize`, { text });
            const data = response.data;
            const descriptionMatch = data.summary.match(/<p>(.*?)<\/p>/);
            setDescription(descriptionMatch ? descriptionMatch[1] : "No description available.");

            const pointsMatch = data.summary.match(/<ul>(.*?)<\/ul>/s);
            if (pointsMatch) {
                const points = pointsMatch[1]
                    .match(/<li>(.*?)<\/li>/g)
                    ?.map((point) => point.replace(/<\/?li>/g, "")) || [];
                setCrucialPoints(points);
            }

        } catch (error) {
            alert('Error summarizing text.', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">AI Text Summarizer</h1>
            <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows={15}
                placeholder="Enter text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                onClick={handleSummarize}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer"
                disabled={loading}
            >
                {loading ? 'Summarizing...' : 'Get Summary'}
            </button>

            {description && (
                <div className="mt-6">
                    <h2 className='mt-5 mb-2 text-xl' >Summary Description</h2>
                    <p dangerouslySetInnerHTML={{ __html: description }} className='text-lg '></p>

                    <h2 className='mt-5 mb-2 text-xl'>Crucial Points</h2>
                    <ul className='flex justify-between items-center gap-4'>
                        {crucialPoints.map((point, index) => (
                            <li key={index} className='px-4 py-2 bg-green-600 text-white rounded-2xl'>{point}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Summarizer;