import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDevelopers } from "../../services/developerService";

function Developers() {
    const navigate = useNavigate();

    const [developers, setDevelopers] = useState([]);
    const [search, setSearch] = useState("");
    const [skill, setSkill] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDevelopers = async () => {
        try {
            setLoading(true);

            const { data } = await getDevelopers({
                search,
                skill,
            });

            setDevelopers(data.developers);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevelopers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Developers</h1>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg p-3"
                />

                <input
                    type="text"
                    placeholder="Search by skill..."
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="border rounded-lg p-3"
                />
            </div>

            <button
                onClick={fetchDevelopers}
                className="mb-8 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
                Search
            </button>

            {loading ? (
                <div className="text-center text-xl">
                    Loading...
                </div>
            ) : developers.length === 0 ? (
                <div className="text-center text-gray-500">
                    No developers found.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {developers.map((dev) => (
                        <div
                            key={dev._id}
                            className="bg-white rounded-xl shadow p-6 flex flex-col min-h-[500px]"
                        >
                            <div className="flex flex-col items-center h-full">
                                <img
                                    src={
                                        dev.photoUrl ||
                                        "https://ui-avatars.com/api/?name=Developer"
                                    }
                                    alt="Developer"
                                    className="w-24 h-24 rounded-full object-cover border"
                                />

                                <h2 className="text-xl font-bold mt-4 text-center">
                                    {dev.firstName} {dev.lastName}
                                </h2>

                                <p className="text-gray-500 text-center mt-2 min-h-[48px]">
                                    {dev.about || "No bio added"}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap justify-center gap-2 mt-4 min-h-[72px] content-start">
                                    {dev.skills?.length > 0 ? (
                                        dev.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No skills added
                                        </span>
                                    )}
                                </div>

                                {/* Push bottom section */}
                                <div className="mt-auto w-full">
                                    <div className="flex justify-center gap-10 pt-4">
                                        <div>
                                            <p className="font-bold text-center">
                                                {dev.followers?.length || 0}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Followers
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-bold text-center">
                                                {dev.following?.length || 0}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Following
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(`/developers/${dev._id}`)
                                        }
                                        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Developers;