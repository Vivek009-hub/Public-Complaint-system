export const calculateSeverity = (complaint)=>{
    let score = 0;

     const categoryWeights = {
    water: 10,
    electricity: 20,
    road: 15,
    garbage: 8,
    other: 5
  };

  score += categoryWeights[complaint.category] || 5;

  // Votes impact

  score += complaint.votes.length * 2;

  // Age Impact

  const daysOld = (Date.now() - new Date(complaint.createdAt)) /(1000 * 60 * 60 * 24);

  score += Math.floor(daysOld);

  return score;
}