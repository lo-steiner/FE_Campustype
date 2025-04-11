import RunDetails from '../../components/RunDetails/RunDetails.jsx';
import TypingResultAPI from '../../lib/api/TypingResult.js';

export default function RunDetailsPage({ post }) {
    if (!post) return <div>No data available</div>;

    return (
        <RunDetails props={post} />
    );
}

export async function getStaticPaths() {
    try {

        const results = await TypingResultAPI.getAllResults();
        
        const paths = results.map((result) => ({
            params: { id: result.id.toString() },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
}

export async function getStaticProps({ params }) {
    try {
        const post = await TypingResultAPI.getRun(params.id);

        if (!post) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                post,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true,
        };
    }
}