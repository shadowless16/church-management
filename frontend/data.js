// Mock data for the church management system
const mockData = {
    members: {
        members: [
            {
                id: "GC-1001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "(555) 123-4567",
                status: "Active",
                ministry: ["Worship Team", "Men's Ministry"],
                joinDate: "2020-01-15",
                dateOfBirth: "1985-03-20",
                gender: "Male",
                address: {
                    street: "123 Main St",
                    city: "Springfield",
                    state: "IL",
                    zip: "62701"
                }
            },
            {
                id: "GC-1002",
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.j@example.com",
                phone: "(555) 987-6543",
                status: "Active",
                ministry: ["Children's Ministry"],
                joinDate: "2019-03-22",
                dateOfBirth: "1990-07-15",
                gender: "Female",
                address: {
                    street: "456 Oak Ave",
                    city: "Springfield",
                    state: "IL",
                    zip: "62702"
                }
            },
            {
                id: "GC-1003",
                firstName: "Michael",
                lastName: "Brown",
                email: "michael.b@example.com",
                phone: "(555) 456-7890",
                status: "New",
                ministry: [],
                joinDate: "2023-06-05",
                dateOfBirth: "1988-11-30",
                gender: "Male",
                address: {
                    street: "789 Pine St",
                    city: "Springfield",
                    state: "IL",
                    zip: "62703"
                }
            },
            {
                id: "GC-1004",
                firstName: "Emily",
                lastName: "Wilson",
                email: "emily.w@example.com",
                phone: "(555) 789-0123",
                status: "Inactive",
                ministry: ["Women's Ministry"],
                joinDate: "2021-08-12",
                dateOfBirth: "1992-04-08",
                gender: "Female",
                address: {
                    street: "321 Elm St",
                    city: "Springfield",
                    state: "IL",
                    zip: "62704"
                }
            },
            {
                id: "GC-1005",
                firstName: "Robert",
                lastName: "Miller",
                email: "robert.m@example.com",
                phone: "(555) 234-5678",
                status: "Active",
                ministry: ["Outreach", "Men's Ministry"],
                joinDate: "2018-11-30",
                dateOfBirth: "1975-09-12",
                gender: "Male",
                address: {
                    street: "654 Maple Ave",
                    city: "Springfield",
                    state: "IL",
                    zip: "62705"
                }
            }
        ],
        stats: {
            totalMembers: 1248,
            activeMembers: 892,
            newThisMonth: 42,
            inactiveMembers: 156
        }
    },

    events: {
        events: [
            {
                id: "1",
                title: "Sunday Service",
                description: "Weekly Worship",
                date: "2024-01-21",
                time: "9:00 AM - 12:00 PM",
                location: "Main Sanctuary",
                ministry: "Worship",
                organizer: "Pastor John Smith",
                attendance: 342,
                status: "Recurring",
                recurring: true
            },
            {
                id: "2",
                title: "Children's Ministry Meeting",
                description: "Monthly planning meeting",
                date: "2024-01-19",
                time: "6:30 PM - 8:00 PM",
                location: "Room 203",
                ministry: "Children's Ministry",
                organizer: "Sarah Johnson",
                attendance: 15,
                status: "Planning",
                recurring: false
            },
            {
                id: "3",
                title: "Youth Group",
                description: "Weekly youth gathering",
                date: "2024-01-18",
                time: "7:00 PM - 9:00 PM",
                location: "Youth Hall",
                ministry: "Youth",
                organizer: "Mike Davis",
                attendance: 45,
                status: "Completed",
                recurring: true
            },
            {
                id: "4",
                title: "Bible Study",
                description: "Wednesday evening Bible study",
                date: "2024-01-17",
                time: "7:00 PM - 8:30 PM",
                location: "Fellowship Hall",
                ministry: "Adult Ministry",
                organizer: "Pastor John Smith",
                attendance: 78,
                status: "Completed",
                recurring: true
            }
        ]
    },

    donations: {
        donations: [
            {
                id: "D001",
                donor: "John Doe",
                amount: 500,
                date: "2024-01-15",
                type: "Tithe",
                method: "Check",
                campaign: "General Fund"
            },
            {
                id: "D002",
                donor: "Sarah Johnson",
                amount: 250,
                date: "2024-01-14",
                type: "Offering",
                method: "Online",
                campaign: "Building Fund"
            },
            {
                id: "D003",
                donor: "Anonymous",
                amount: 1000,
                date: "2024-01-13",
                type: "Special Gift",
                method: "Cash",
                campaign: "Missions"
            },
            {
                id: "D004",
                donor: "Michael Brown",
                amount: 150,
                date: "2024-01-12",
                type: "Tithe",
                method: "Online",
                campaign: "General Fund"
            }
        ],
        stats: {
            totalThisMonth: 15420,
            totalLastMonth: 14850,
            averageDonation: 285,
            totalDonors: 156
        }
    }
};