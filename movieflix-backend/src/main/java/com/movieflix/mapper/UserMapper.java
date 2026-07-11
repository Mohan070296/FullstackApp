package com.movieflix.mapper;

import com.movieflix.dto.UserDto;
import com.movieflix.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    UserDto toDto(User user);
    List<UserDto> toDtos(List<User> users);
    User toEntity(UserDto userDto);
}