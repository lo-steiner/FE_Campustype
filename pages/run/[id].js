import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RunDetails from '../../components/RunDetails/RunDetails.jsx';
import TypingResult from "../../lib/api/TypingResult.js";
import TypingResultAPI from "../../lib/api/TypingResult.js";

export default function RunDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                const response = await TypingResultAPI.getRun(id);
                setPost(response);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>No data available</div>;

    return (
        <RunDetails props={post} />
    );
}