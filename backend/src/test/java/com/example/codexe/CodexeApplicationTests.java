package com.example.codexe;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.codexe.model.User;
import com.example.codexe.service.UserService;

@SpringBootTest
class CodexeApplicationTests {

	@Autowired
	private UserService userService;

	@Test
	void testCreateUser() {
		User user = new User(
			"example2@email.com",
			"root",
			"password",
			0,
			0,
			0
		);

		user = userService.createUser(user);
		assertNotNull(user);
	}

}
