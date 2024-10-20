import React from "react";

const teamMembers = [
  { name: "Swaraj Mahadik", prn: "122B1B159" },
  { name: "Anuj Loharkar", prn: "122B1B154" },
  { name: "Aishwarya Marathe", prn: "122B1B170" },
  { name: "Vishakha Lalwani", prn: "122B1B151" },
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold">Subject</h3>
          <p className="text-red-500 text-lg">
            Data Mining and Warehousing Lab(PBL III)
          </p>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Our Team</h2>
          <div className="w-16 h-1 bg-red-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-lg">
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-400">PRN: {member.prn}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Movie Recommendations. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
