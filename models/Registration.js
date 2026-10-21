const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    teamName: { type: String },
    coachName: { type: String },
    coachPhone: { type: String },
    coachEmail: { type: String },
    phone: { type: String },
    email: { type: String },

    // Athletes with complete Category, Division, Belt & Video persistence
    athletes: [
      {
        name: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'male', 'female'], default: 'Male' },
        age: { type: Number },
        cnic: { type: String },
        cnicOrBForm: { type: String },
        subCategory: { type: String, default: 'white' },
        division: { type: String, default: 'white' },
        subDivision: { type: String, default: 'white' },
        belt: { type: String, default: 'white' },
        categoryName: { type: String },
        selectedCategories: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        ],
        categories: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        ],
        // Persistent video links
        videoUrl: { type: String, default: '' },
        submissionVideoUrl: { type: String, default: '' },
        youtubeUrl: { type: String, default: '' },
        videoStatus: { type: String, default: 'pending' },
        submissionDate: { type: Date },
      },
    ],

    totalAthletes: { type: Number, default: 0 },
    athletesCount: { type: Number, default: 0 },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],

    // Payment Details
    paymentOption: { type: String, enum: ['full', 'half'], default: 'full' },
    totalAmountDue: { type: Number, required: true },
    totalAmountPaid: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 },

    // Payment Slips & Proofs
    transactionId: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    paymentSlipUrl: { type: String },
    slipUrl: { type: String },
    receiptUrl: { type: String },
    proofUrl: { type: String },
    paymentProofUrl: { type: String },

    // Secondary / Remaining Payment Slips
    remainingSlipUrl: { type: String },
    remainingPaymentSlipUrl: { type: String },
    remainingTransactionId: { type: String },
    remainingPaymentDate: { type: Date },

    // Root-level video fallback
    videoSubmissionUrl: { type: String, default: '' },

    registrationStatus: {
      type: String,
      enum: ['pending', 'under_review', 'pending_payment', 'approved', 'rejected'],
      default: 'under_review',
    },
    status: { type: String, default: 'under_review' },
    paymentStatus: { type: String, default: 'Pending' },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('Registration', registrationSchema);