import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import PlayerProfile from './src/models/PlayerProfile';
import Team from './src/models/Team';
import StaffProfile from './src/models/StaffProfile';
import Job from './src/models/Job';
import Post from './src/models/Post';
import PersonalChat from './src/models/PersonalChat';
import Notification from './src/models/Notification';
import RefreshToken from './src/models/RefreshToken';
import logger from './src/config/logger';

dotenv.config();

const MOCK_PASSWORD = 'password123'; // Plain text, will be hashed by Mongoose schema pre-save hook

const seed = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scoutify';
    logger.info(`Connecting to database: ${mongoURI}`);
    await mongoose.connect(mongoURI);

    logger.info('Clearing database collections...');
    await User.deleteMany({});
    await PlayerProfile.deleteMany({});
    await Team.deleteMany({});
    await StaffProfile.deleteMany({});
    await Job.deleteMany({});
    await Post.deleteMany({});
    await PersonalChat.deleteMany({});
    await Notification.deleteMany({});
    await RefreshToken.deleteMany({});
    logger.info('Database cleared.');

    logger.info('Creating mock Users...');
    
    // Players (Athletes)
    const userStriker = await User.create({ username: 'striker', email: 'striker@scoutify.com', password: MOCK_PASSWORD, role: 'player' });
    const userKeeper = await User.create({ username: 'keeper', email: 'keeper@scoutify.com', password: MOCK_PASSWORD, role: 'player' });
    const userMidfielder = await User.create({ username: 'midfielder', email: 'midfielder@scoutify.com', password: MOCK_PASSWORD, role: 'player' });

    // Teams (Clubs)
    const userUnited = await User.create({ username: 'united', email: 'united@scoutify.com', password: MOCK_PASSWORD, role: 'team' });
    const userCityFC = await User.create({ username: 'cityfc', email: 'cityfc@scoutify.com', password: MOCK_PASSWORD, role: 'team' });

    // Staff (Coaches/Physios)
    const userCoach = await User.create({ username: 'coach', email: 'coach@scoutify.com', password: MOCK_PASSWORD, role: 'staff' });
    const userPhysio = await User.create({ username: 'physio', email: 'physio@scoutify.com', password: MOCK_PASSWORD, role: 'staff' });

    logger.info('Users created. Generating profiles...');

    // Seed Player Profiles
    const profileStriker = await PlayerProfile.create({
      userID: userStriker._id,
      position: 'Striker',
      heightCm: 188,
      weightKg: 82,
      preferredFoot: 'Right',
      currentTeam: 'Manchester Academicals',
      contractStatus: 'Free-Agent',
      isLookingForJob: true,
      bio: 'Prolific striker with an eye for goal. Former academy player with 24 goals last season. Eager to join a professional club.',
      profileImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80'
    });

    const profileKeeper = await PlayerProfile.create({
      userID: userKeeper._id,
      position: 'Goalkeeper',
      heightCm: 195,
      weightKg: 90,
      preferredFoot: 'Left',
      currentTeam: 'London Rovers',
      contractStatus: 'Under-Contract',
      isLookingForJob: false,
      bio: 'Calm, commanding presence between the sticks. Specialized in penalty-saving and aerial collection.',
      profileImage: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=400&auto=format&fit=crop&q=80'
    });

    const profileMidfielder = await PlayerProfile.create({
      userID: userMidfielder._id,
      position: 'Central Midfielder',
      heightCm: 180,
      weightKg: 75,
      preferredFoot: 'Both',
      currentTeam: '',
      contractStatus: 'Trial',
      isLookingForJob: true,
      bio: 'Box-to-box midfielder with exceptional passing range and vision. Creative playmaker.',
      profileImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=80'
    });

    // Seed Team Profiles
    const profileUnited = await Team.create({
      userID: userUnited._id,
      name: 'Manchester United FC',
      city: 'Manchester',
      email: 'recruitment@manunited.com',
      biography: 'One of the most decorated clubs in world football, currently rebuilding our squad and seeking young, motivated elite athletes.',
      recruiting: true
    });

    const profileCityFC = await Team.create({
      userID: userCityFC._id,
      name: 'Middlesbrough FC',
      city: 'Middlesbrough',
      email: 'info@mfc.com',
      biography: 'Championship club focusing on bringing talent through our highly-rated academy system.',
      recruiting: true
    });

    // Seed Staff Profiles
    const profileCoach = await StaffProfile.create({
      userID: userCoach._id,
      roleDescription: 'UEFA A Licensed Coach',
      experienceYears: 12,
      certifications: ['UEFA A Licence', 'FA Youth Award Module 3', 'Sport Science Degree'],
      currentTeam: 'Newcastle Academy',
      isLookingForJob: true,
      bio: 'Tactical specialist with over 10 years developing youth into professional footballers. Focused on high-pressing styles.',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
    });

    const profilePhysio = await StaffProfile.create({
      userID: userPhysio._id,
      roleDescription: 'Sports Physiotherapist',
      experienceYears: 6,
      certifications: ['MSc Physiotherapy', 'HCPC Registered', 'ACPSM Bronze Member'],
      currentTeam: 'Leeds Medical Dept',
      isLookingForJob: false,
      bio: 'Expert in sports rehabilitation and soft tissue recovery. Specializing in hamstring and ACL reconstruction return-to-play programs.',
      profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80'
    });

    logger.info('Profiles created. Generating Jobs...');

    // Seed Jobs (Posted by Teams and Staff)
    const jobStriker = await Job.create({
      profileId: profileUnited._id,
      profileModel: 'Team',
      title: 'First Team Striker / Center Forward',
      description: 'Looking for a physical, goalscoring forward to lead the line. Must have high press workrate, championship experience preferred. Competitive wage.',
      city: 'Manchester',
      jobType: 'Full-Time',
      status: true
    });

    const jobPhysio = await Job.create({
      profileId: profileCityFC._id,
      profileModel: 'Team',
      title: 'Lead Academy Physiotherapist',
      description: 'Responsible for medical care, diagnosis, and injury rehabilitation of U18 and U21 squads. Must hold HCPC registration and sports rehabilitation experience.',
      city: 'Middlesbrough',
      jobType: 'Contract',
      status: true
    });

    const jobScout = await Job.create({
      profileId: userCoach._id, // Posted by a Staff user directly
      profileModel: 'User',
      title: 'Part-Time Youth Scout (North West)',
      description: 'Looking for a local scout to cover school tournaments and junior league divisions around Liverpool and Manchester. Flexible hours.',
      city: 'Liverpool',
      jobType: 'Part-Time',
      status: true
    });

    logger.info('Jobs created. Generating Feed Posts...');

    // Seed Social Feed Posts
    await Post.create({
      profileId: userStriker._id,
      profileModel: 'User',
      content: 'Fitted in a double training session today. Speed drills in the morning, followed by finishing practice. Free agent and ready to contribute to a squad this pre-season! ⚽️🏃‍♂️',
      targetRole: 'Striker',
      location: 'Manchester',
      media: [{
        url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
        type: 'image'
      }],
      likes: [userKeeper._id, userCoach._id]
    });

    await Post.create({
      profileId: profileUnited._id,
      profileModel: 'Team',
      content: 'We are thrilled to announce open trials for our reserve and academy rosters next week! We are seeking players in Center Back and Striker positions. Apply directly to our job posts on Scoutify.',
      location: 'Manchester Training Complex',
      media: [],
      likes: [userStriker._id, userMidfielder._id, userPhysio._id]
    });

    await Post.create({
      profileId: userPhysio._id,
      profileModel: 'User',
      content: 'Interesting case study today regarding eccentric strength loading for hamstring strain prevention. Rest and ice is obsolete; active recovery and progressive loading is key! 🏥🏋️‍♂️',
      targetRole: 'Physiotherapist',
      location: 'Leeds',
      media: [],
      likes: [userCoach._id]
    });

    logger.info('Posts created. Generating Chats & Messages...');

    // Seed Personal Chats (Conversations)
    await PersonalChat.create([
      {
        sender: userStriker._id,
        receiver: userUnited._id,
        content: 'Hello, I saw your job post for First Team Striker. I am interested and have uploaded my career statistics.'
      },
      {
        sender: userUnited._id,
        receiver: userStriker._id,
        content: 'Hi! Thanks for reaching out. We looked at your profile and like your finishing stats. Are you available for a trial match next Wednesday?'
      },
      {
        sender: userStriker._id,
        receiver: userUnited._id,
        content: 'Absolutely. I am fit and ready. Let me know the arrival details.'
      },
      {
        sender: userUnited._id,
        receiver: userStriker._id,
        content: 'Great. We will send you the details via email shortly.'
      }
    ]);

    // Another chat
    await PersonalChat.create([
      {
        sender: userCoach._id,
        receiver: userKeeper._id,
        content: 'Hi, are you open to moving clubs this summer? We need a keeper for our senior squad.'
      },
      {
        sender: userKeeper._id,
        receiver: userCoach._id,
        content: 'Hi Coach. I am currently under contract but my club is open to transfer listings or loans if the opportunity is right.'
      }
    ]);

    logger.info('Chats created. Generating Notifications...');

    // Seed Notifications
    await Notification.create({
      sender: userStriker._id,
      receiver: userUnited._id,
      type: 'job_application',
      content: `A candidate has applied to your job listing: "${jobStriker.title}"`,
      sourceLink: '/jobs',
      isRead: false
    });

    await Notification.create({
      sender: userUnited._id,
      receiver: userStriker._id,
      type: 'post_like',
      content: 'Manchester United FC liked your post',
      sourceLink: '/feed',
      isRead: true
    });

    await Notification.create({
      sender: userCoach._id,
      receiver: userKeeper._id,
      type: 'message',
      content: 'New message: "Hi, are you open to moving clubs..."',
      sourceLink: '/messages',
      isRead: false
    });

    logger.info('Mock seeding completed successfully!');
    process.exit(0);
  } catch (err: any) {
    logger.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
