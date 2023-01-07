// 路由实现
import Router from '@koa/router';

import AuthController from './controllers/AuthController';
import UserController from './controllers/User';
import StudentAdminController from './controllers/StudentAdmin';
import DeptController from './controllers/Dept';
import BlogController from './controllers/BlogController';
import SocialPrcController from './controllers/SocialPrcController';
import StuBasicInfoController from './controllers/StuBasicInfo';
import StuCourseController from './controllers/StuCourseController';
import UploadController from './controllers/UploadController';
import SelectCourseController from './controllers/SelectCourseController';
import ScoreController from './controllers/ScoreController';
import ExtraCurricularController from './controllers/ExtraCurricularController';
import AchievementController from './controllers/AchievementController';
import EvaluateController  from './controllers/EvaluateController';
import CourseController  from './controllers/CourseController';
import TeaBasicInfoController  from './controllers/TeaBasicInfoController';
import EmailController from './controllers/EmailController';
import PortraitController from './controllers/potraitController';
import CourseInquireController from './controllers/CourseInquireController';
import TeachManageController from './controllers/TeachManageController';

const unprotectedRouter = new Router();

unprotectedRouter.post('/auth/login/user', AuthController.loginUser);
unprotectedRouter.post('/auth/login/logout', AuthController.logout);
unprotectedRouter.get('/auth/login/yzm', AuthController.loginYzm);
unprotectedRouter.post('/auth/register', AuthController.register);
unprotectedRouter.post('/users/resetPwd',AuthController.resetPwd);  //忘记密码
unprotectedRouter.post('/pwd/changePwd',UserController.changePwd);  //登录状态改密码
unprotectedRouter.get('/dpt/getDptName', DeptController.getDeptName);

const protectedRouter = new Router();

//跟账号相关
unprotectedRouter.post('/users', UserController.listUsers);
// unprotectedRouter.get('/users/:name', UserController.showUserDetail);
// unprotectedRouter.post('/users/add',AuthController.register);
// unprotectedRouter.put('/users/:name', UserController.updateUser);
unprotectedRouter.post('/users/delete', UserController.deleteUser);


//邮箱验证码
unprotectedRouter.post('/sendEmail',EmailController.getEmailCode );
unprotectedRouter.post('/checkEmailCode',EmailController.checkEmailCode );

//开课
unprotectedRouter.post('/course/listCourse',CourseController.listCourse);
unprotectedRouter.post('/course/loadButton',CourseController.loadState);
unprotectedRouter.post('/course/openOrCloseCourse',CourseController.openOrCloseCourse);
unprotectedRouter.post('/course/addCourse',CourseController.addCourse);
unprotectedRouter.post('/course/updateCourse',CourseController.updateCourse);
unprotectedRouter.post('/course/deleteCourse',CourseController.deleteCourse);
//选课
unprotectedRouter.post('/stu/selectCourse',SelectCourseController.selectCourse);
unprotectedRouter.post('/stu/listCourse',SelectCourseController.listCourse); //学生端显示可选的课
unprotectedRouter.post('/stu/deleteSelect',SelectCourseController.deleteSelect);

//课表
unprotectedRouter.post('/stu/getTermTable',StuCourseController.thisTermTable);

//成绩
unprotectedRouter.post('/stu/getScoreTable',ScoreController.checkScore);
unprotectedRouter.post('/stu/getGPA',ScoreController.calculateGPA);

//学生基本信息
unprotectedRouter.post('/stuBasicInfo/getInfoTable', StuBasicInfoController.listStuBasicInfo);
unprotectedRouter.post('/stuBasicInfo/getInfo',StuBasicInfoController.showStuBasicInfoDetail);
unprotectedRouter.post('/stuBasicInfo/add',StuBasicInfoController.addStuBasicInfo);
unprotectedRouter.post('/stuBasicInfo/update',StuBasicInfoController.updateStuBasicInfo);
unprotectedRouter.post('/stuBasicInfo/delete',StuBasicInfoController.deleteStuBasicInfo);

//教师基本信息
unprotectedRouter.post('/teaBasicInfo/getInfoTable', TeaBasicInfoController.listTeaBasicInfo);
unprotectedRouter.post('/teaBasicInfo/getInfo',TeaBasicInfoController.showTeaBasicInfoDetail);
unprotectedRouter.post('/teaBasicInfo/changePartInfo',TeaBasicInfoController.changeInfo);
unprotectedRouter.post('/teaBasicInfo/add',TeaBasicInfoController.addTeaBasicInfo);
unprotectedRouter.post('/teaBasicInfo/update',TeaBasicInfoController.updateTeaBasicInfo);
unprotectedRouter.post('/teaBasicInfo/delete',TeaBasicInfoController.deleteTeaBasicInfo);

//返回前端所有教师的名字
unprotectedRouter.post('/teaBasicInfo/getTeacherName', TeaBasicInfoController.listTeacherName);

//教师端方法
unprotectedRouter.post('/teacher/showTermSchedule', CourseInquireController.showTermSchedule);//学期课表
unprotectedRouter.post('/teacher/showClassroomSchedule',CourseInquireController.showClassroomSchedule);//教室课表
unprotectedRouter.post('/teacher/showTeachCourse',TeachManageController.showTeachCourse);//教学班级
unprotectedRouter.post('/teacher/showTeachManage',TeachManageController.showTeachManage);//教学任务
unprotectedRouter.post('/teacher/updateStudentScore',TeachManageController.updateStudentScore);//更改学生成绩
unprotectedRouter.post('/teacher/showCourse',TeachManageController.showCourse);////教师端查询教学课程

//社会实践 
unprotectedRouter.post('/social_prc/list/getInfoTable', SocialPrcController.listSocialPrc);
unprotectedRouter.post('/social_prc/list/getInfo',SocialPrcController.showSocialPrcDetail);
unprotectedRouter.post('/social_prc/add',SocialPrcController.addSocialPrc);
unprotectedRouter.post('/social_prc/update',SocialPrcController.updateSocialPrc);
unprotectedRouter.post('/social_prc/delete',SocialPrcController.deleteSocialPrc);

//课外活动
unprotectedRouter.post('/extraCurricular/list/getInfoTable', ExtraCurricularController.listExCurricular);
unprotectedRouter.post('/extraCurricular/list/getInfo',ExtraCurricularController.showExCurricularDetail);
unprotectedRouter.post('/extraCurricular/add',ExtraCurricularController.addExCurricular);
unprotectedRouter.post('/extraCurricular/update',ExtraCurricularController.updateExCurricular);
unprotectedRouter.post('/extraCurricular/delete',ExtraCurricularController.deleteExCurricular);

//成果奖励
unprotectedRouter.post('/achievement/list/getInfoTable', AchievementController.listAchieve);
unprotectedRouter.post('/achievement/list/getInfo',AchievementController.showAchieveDetail);
unprotectedRouter.post('/achievement/add',AchievementController.addAchieve);
unprotectedRouter.post('/achievement/update',AchievementController.updateAchieve);
unprotectedRouter.post('/achievement/delete',AchievementController.deleteAchieve);

//学生互评
unprotectedRouter.post('/evaluate/listEvaluation',EvaluateController.listEvaluation);
unprotectedRouter.post('/evaluate/listClass',EvaluateController.listClass);
unprotectedRouter.post('/evaluate/doEvaluate',EvaluateController.evaluate);
unprotectedRouter.post('/evaluate/meEvaluated',EvaluateController.meEvaluated);
unprotectedRouter.post('/evaluate/evaluateMe',EvaluateController.evaluateMe);
unprotectedRouter.post('/evaluate/deleteEvaluate',EvaluateController.deleteEvaluate);
unprotectedRouter.post('/evaluate/admDeleteEvaluate',EvaluateController.admDeleteEvaluate);


//个人博客
unprotectedRouter.post('/blog/listBlogs',BlogController.listBlogs);
unprotectedRouter.post('/blog/blogDetail',BlogController.blogDetail);
unprotectedRouter.post('/blog/addBlog',BlogController.addBlog);
unprotectedRouter.post('/blog/deleteBlog',BlogController.deleteBlog);

//用户画像
unprotectedRouter.post('/portrait/listCharacter',PortraitController.listCharacter);

//头像上传
unprotectedRouter.post('/user/addPhoto',UploadController.addPhoto);

export { protectedRouter, unprotectedRouter };
