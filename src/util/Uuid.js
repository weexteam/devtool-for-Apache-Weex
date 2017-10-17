/**
 * Created by godsong on 16/6/23.
 */
module.exports = function () {
  const stamp = new Date().getTime();
  const rand = +(Math.random() + '').slice(2);
  return stamp.toString(36) + rand.toString(36);
};
