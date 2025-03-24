import { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '../StarRating';

const conversationTypes = ["IT/ITES", "BFSI", "Healthcare", "Retail", "Public Sector", "Education"];

export default function ConversationAnalyzer() {
    const [type, setType] = useState(conversationTypes[0]);
    const [text, setText] = useState("");
    const [prompt, setPrompt] = useState("");
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ratingData, setRatingData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showALl, setShowAll] = useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/analyze`, { type, text, prompt });
            setScore(response.data.data.score);
            setText("");
            setPrompt("");
            setRefresh(true);
        } catch (error) {
            console.error("Error analyzing conversation", error);
        }
        setLoading(false);
    };

    const handleFetchAllRatings = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/get-all-score`);
            if (response.status === 200) {
                setRatingData(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchAllRatings();
    }, [])


    useEffect(() => {
        if (refresh) {
            handleFetchAllRatings();
            setRefresh(false);
        }
    }, [refresh])

    return (
        <>
            <div className="md:py-12 flex justify-center items-center">
                <div className="max-w-2xl min-w-96 mx-auto p-6   shadow-2xl shadow-blue-400 rounded-lg">
                    <img src="https://radius-ois.ai/wp-content/uploads/2023/10/radius0logo.png" alt="radius logo" loading='lazy' className='w-64 mx-auto mb-4 animate-pulse' />
                    <h1 className="text-2xl font-bold mb-4">Rating Analyzer</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Type</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {conversationTypes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Conversation Text</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="4"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Prompt</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Submit"}
                    </button>

                    {score !== null && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Analysis Score {score}</h2>
                            <div className="flex gap-1 mt-2">
                                <StarRating score={score} />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <button onClick={() => setShowAll(!showALl)} className="bg-blue-500 text-white px-4 py-2 mt-6 rounded-2xl">
                {showALl ? 'Show All' : 'Show Completed'}
            </button>

            <div className="max-w-7xl mx-auto p-4 flex flex-wrap gap-10">
                {showALl && ratingData && ratingData.length > 0 ? (
                    ratingData.map((rating, index) => (
                        <div key={rating._id || index} className="bg-gray-800 hover:bg-gray-900 cursor-pointer p-4 mb-4 rounded-lg shadow-lg text-gray-300 w-96 max-w-xl">
                            <h2 className="text-lg text-white font-semibold">Agent Rating for {rating.type}</h2>
                            <p className="text-gray-100">Score: {rating.score} ⭐</p>
                            <p className="text-gray-100 text-sm">Date: {new Date(rating.createdAt).toLocaleString()}</p>

                            {/* Metadata Display */}
                            <div className="mt-2">
                                <p><strong>Confidentiality:</strong> {rating.metadata.secure_info}</p>
                                <p><strong>Communication Clarity:</strong> {rating.metadata.communication_clarity}</p>
                                <p><strong>Alternative Solutions:</strong> {rating.metadata.alternative_solutions}</p>
                                <p><strong>Call Flow:</strong> {rating.metadata.call_flow}</p>
                                <p><strong>Agent Demeanor:</strong> {rating.metadata.agent_demeanor}</p>
                                <p><strong>Follow-Up:</strong> {rating.metadata.follow_up}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No ratings found.</p>
                )}
            </div>
        </>
    );
}
