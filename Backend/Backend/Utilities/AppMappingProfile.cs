using AutoMapper;
using Backend.DbModels;
using Backend.DtoModels.Frontend;
using System;

namespace Backend.Utilities
{
    public class AppMappingProfile : Profile
    {
        public AppMappingProfile()
        {
            CreateMap<Student, StudentDbo>().ReverseMap();
            CreateMap<Group, GroupDto>().ReverseMap();
            CreateMap<Subject, SubjectDto>().ReverseMap();
            CreateMap<Teacher, TeacherDto>().ReverseMap();
            CreateMap<Subgroup, SubgroupDto>().ReverseMap();
            CreateMap<Schedule, ScheduleDto>().ReverseMap();
            CreateMap<ScheduleAdditionalDate, ScheduleDateDto>().ReverseMap();
            CreateMap<ScheduleRemovedDate, ScheduleDateDto>().ReverseMap();
            CreateMap<CoupleTime, CoupleTimeDto>().ReverseMap();
            CreateMap<SubjectType, SubjectTypeDto>().ReverseMap();
            CreateMap<SubmissionWork, SubmissionWorkDto>().ReverseMap();
            CreateMap<Submission, SubmissionDto>().ReverseMap();

            CreateMap<SubmissionConfig, SubmissionConfigDto>();
            CreateMap<SubmissionConfigDto, SubmissionConfig>().ForMember(x => x.SubmissionWorks, opt => opt.Ignore());
        }
    }
}
