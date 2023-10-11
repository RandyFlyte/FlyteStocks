import clientPromise from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db('flyte-stocks');

  const allComments = await db.collection('positions').find({}).toArray();
  return NextResponse.json({ status: 200, data: allComments });
}

export async function POST(request) {
  // Set requestData to a static value for testing
  const requestData = {
    symbol: 'AAPL',
    price: 145,
    quantity: 10,
  };

  // Await the client and connect to the database
  const client = await clientPromise;
  const db = client.db('flyte-stocks');

  // Insert the new document into the 'positions' collection
  const result = await db.collection('positions').insertOne(requestData);

  // Check the result for success (optional)
  if (result.acknowledged && result.insertedId) {
    return NextResponse.json({
      status: 201,
      data: { insertedId: result.insertedId },
    });
  } else {
    return NextResponse.json({
      status: 500,
      data: { error: 'Failed to insert document' },
    });
  }
}
