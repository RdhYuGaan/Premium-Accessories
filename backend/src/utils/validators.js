function isValidEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isStrongPassword(p){
  return typeof p === 'string' && p.length >= 6;
}
module.exports = { isValidEmail, isStrongPassword };
