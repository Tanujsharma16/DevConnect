import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDeveloperById } from "../../services/developerService";
import { getProjectsByUser } from "../../services/projectService";

function DeveloperProfile() {
    const { id } = useParams();

    const [developer, setDeveloper] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeveloper();
    }, [id]);

    const fetchDeveloper = async () => {
        try {
            setLoading(true);

            const developerRes = await getDeveloperById(id);
            setDeveloper(developerRes.data.developer);

            const projectRes = await getProjectsByUser(id);
            setProjects(projectRes.data.projects);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center text-2xl">
                Loading...
            </div>
        );
    }

    if (!developer) {
        return (
            <div className="text-center text-2xl">
                Developer not found.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">

            <div className="bg-white rounded-xl shadow p-8">

                <div className="flex flex-col md:flex-row gap-8">

                    <img
                        src={developer.photoUrl}
                        alt=""
                        className="w-40 h-40 rounded-full object-cover border"
                    />

                    <div>

                        <h1 className="text-4xl font-bold">
                            {developer.firstName} {developer.lastName}
                        </h1>

                        <p className="mt-3 text-gray-600">
                            {developer.about}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-5">

                            {developer.skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DeveloperProfile;