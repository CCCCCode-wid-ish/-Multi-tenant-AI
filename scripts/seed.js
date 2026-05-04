const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    console.log('--- SEEDING DATABASE ---');

    // 1. Projects
    const projectsCol = db.collection('projects');
    await projectsCol.deleteMany({});
    const project1Id = new ObjectId();
    const project2Id = new ObjectId();

    await projectsCol.insertMany([
      {
        _id: project1Id,
        name: 'Delta Corp',
        slug: 'delta-corp',
        description: 'Main enterprise project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: project2Id,
        name: 'Beta Solutions',
        slug: 'beta-solutions',
        description: 'Secondary client project',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 2. Users
    const usersCol = db.collection('users');
    await usersCol.deleteMany({});
    await usersCol.insertMany([
      {
        name: 'Admin User',
        email: 'admin@project1.com',
        role: 'admin',
        projectId: project1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Member User',
        email: 'member@project1.com',
        role: 'member',
        projectId: project1Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Other Admin',
        email: 'admin@project2.com',
        role: 'admin',
        projectId: project2Id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 3. Product Instances
    const instancesCol = db.collection('productinstances');
    await instancesCol.deleteMany({});
    await instancesCol.insertMany([
      {
        projectId: project1Id,
        nameSpace: 'sales-prod-1',
        productType: 'sales-assistant',
        displayName: 'Sales Master AI',
        systemPrompt: 'You are a professional sales assistant for Delta Corp. You help with order tracking and product info.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: project1Id,
        nameSpace: 'support-prod-1',
        productType: 'support-assistant',
        displayName: 'Technical Support Bot',
        systemPrompt: 'You are a technical support bot for Delta Corp. You are helpful and concise.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 4. Integrations
    const integrationsCol = db.collection('integrations');
    await integrationsCol.deleteMany({});
    await integrationsCol.insertMany([
      {
        projectId: project1Id,
        shopify: true,
        crm: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: project2Id,
        shopify: false,
        crm: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // 5. Dashboard Config
    const configCol = db.collection('dashboardconfigs');
    await configCol.deleteMany({});
    await configCol.insertMany([
      {
        projectId: project1Id,
        sections: [
          {
            title: 'Growth & Metrics',
            widgets: [
              { id: 'w1', type: 'stats', title: 'Total Revenue (Mock)' },
              { id: 'w2', type: 'stats', title: 'Active Conversations' },
              { id: 'w3', type: 'stats', title: 'New Leads' },
              { id: 'w4', type: 'stats', title: 'Success Rate' },
            ],
          },
          {
            title: 'Analytics & Insights',
            widgets: [
              { id: 'w5', type: 'chart', title: 'Weekly Engagement' },
              { id: 'w6', type: 'activity', title: 'Recent Platform Activity' },
            ],
          },
          {
            title: 'System Integrations',
            widgets: [
              { id: 'w7', type: 'integrations', title: 'Active Connected Services' },
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: project2Id,
        sections: [
          {
            title: 'Beta Solutions Overview',
            widgets: [
              { id: 'wb1', type: 'stats', title: 'Client Health' },
              { id: 'wb2', type: 'stats', title: 'Project Velocity' },
            ],
          },
          {
            title: 'Resource Allocation',
            widgets: [
              { id: 'wb3', type: 'activity', title: 'Team Activity' },
            ],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('--- SEEDING COMPLETE ---');
    console.log('Try logging in with: admin@project1.com');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();
